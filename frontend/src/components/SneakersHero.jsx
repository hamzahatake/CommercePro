import Banner from "../../public/Banner/Banner.webp";

export function SneakerBanner() {
    return(
        <div className="w-full h-[500px] overflow-hidden">
            <img 
            src={Banner} 
            alt="Banner"
            className="rounded-2xl w-full h-full object-cover object-top"/>
        </div>
    )
}