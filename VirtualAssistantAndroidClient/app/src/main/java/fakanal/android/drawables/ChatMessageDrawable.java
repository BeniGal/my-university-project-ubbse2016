package fakanal.android.drawables;

import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.Outline;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.drawable.Drawable;

public class ChatMessageDrawable extends Drawable {

    private final Paint paint;
    private final RectF boundsF;
    private final Rect boundsI;
    private float radius;
    private float padding;
    private boolean insetForPadding;
    private boolean insetForRadius = true;

    public ChatMessageDrawable(int backgroundColor, float radius) {
        this.radius = radius;
        paint = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.DITHER_FLAG);
        paint.setColor(backgroundColor);
        boundsF = new RectF();
        boundsI = new Rect();
    }

    void setPadding(float padding, boolean insetForPadding, boolean insetForRadius) {
        if (padding == this.padding && this.insetForPadding == insetForPadding &&
                this.insetForRadius == insetForRadius) {
            return;
        }
        this.padding = padding;
        this.insetForPadding = insetForPadding;
        this.insetForRadius = insetForRadius;
        updateBounds(null);
        invalidateSelf();
    }

    float getPadding() {
        return padding;
    }

    @Override
    public void draw(Canvas canvas) {
        canvas.drawRoundRect(boundsF, radius, radius, paint);
    }

    private void updateBounds(Rect bounds) {
        if (bounds == null) {
            bounds = getBounds();
        }
        boundsF.set(bounds.left, bounds.top, bounds.right, bounds.bottom);
        boundsI.set(bounds);
    }

    @Override
    protected void onBoundsChange(Rect bounds) {
        super.onBoundsChange(bounds);
        updateBounds(bounds);
    }

    @Override
    public void getOutline(Outline outline) {
        outline.setRoundRect(boundsI, radius);
    }

    @Override
    public void setAlpha(int alpha) {
        // not supported because older versions do not support
    }

    @Override
    public void setColorFilter(ColorFilter cf) {
        // not supported because older versions do not support
    }

    @Override
    public int getOpacity() {
        return PixelFormat.TRANSLUCENT;
    }

    public float getRadius() {
        return radius;
    }

    void setRadius(float radius) {
        if (radius == this.radius) {
            return;
        }
        this.radius = radius;
        updateBounds(null);
        invalidateSelf();
    }

    public void setColor(int color) {
        paint.setColor(color);
        invalidateSelf();
    }

    public Paint getPaint() {
        return paint;
    }
}