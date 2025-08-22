from rest_framework.response import Response
from rest_framework import viewsets
from .serializers import VendorProfileSerializer
from .models import VendorProfile
from django.utils import timezone
from django.db import transaction
from .tasks import send_welcome_email_task


class VendorProfileView(viewsets.ModelViewSet):
    queryset = VendorProfile.objects.all()
    serializer_class = VendorProfileSerializer

    def approve_vendor(self, request, id):

        if request.user.role != 'admin':
            return Response({"detail": "Permission denied"}, status=403)

        vendor = VendorProfile.objects.get(id=id)
        vendor_user = vendor.user  

        if vendor_user.is_active or vendor.approval_status != 'pending':
            return Response({"detail": "Vendor already active or not pending"}, status=400)

        with transaction.atomic():
            vendor_user.is_active = True
            vendor.approved_at = timezone.now()
            vendor.approved_by = request.user
            vendor.approval_status = 'approved'

            vendor_user.save()
            vendor.save()

        send_welcome_email_task.delay(vendor.id, vendor.email, vendor.username)


        return Response({"success": True, "vendor_id": id, "status": "approved"})

