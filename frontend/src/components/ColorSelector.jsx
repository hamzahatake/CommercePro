export function ColorSelector({ colors, selectedColor, onSelect }) {
    return (
        <div className="flex gap-2">
            {colors.map((color) => (
                <button
                    key={color.id}
                    style={{ backgroundColor: color.hex_code }}
                    className={`w-6 h-6 rounded-full border-2 ${selectedColor === color.name ? "ring-2 ring-white" : "border-gray-300"
                        }`}
                    onClick={() => onSelect(color.name)}
                />
            ))}
        </div>
    );
}
