function draw(ctx, x, y, color, radius) {
    ctx.fillStyle = color;

    // Set the shadow properties
    ctx.shadowColor = color; // The color of the glow
    ctx.shadowBlur = 100; // Adjust this value to increase or decrease the glow effect

    // Draw the circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Reset the shadow properties to avoid affecting other canvas elements
    ctx.shadowColor = null;
    ctx.shadowBlur = 0;
}
