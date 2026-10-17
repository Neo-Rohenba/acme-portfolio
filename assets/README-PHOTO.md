# Add the daytime exterior photo

Save the wide daylight shot of the building (blue sky, full facade, forecourt)
to this folder as:

    exterior-day.webp      (preferred)
    exterior-day.jpg       (also works)

Every design in ../hero-premium-50.html references it as a stacked CSS layer:

    background-image: url('assets/exterior-day.webp'),
                      url('assets/exterior-day.jpg'),
                      url('assets/header.webp');

CSS paints the FIRST layer that loads on top. Until exterior-day exists you see
header.webp (the night shot); the moment you drop the file in, all 50 designs
switch over with no code change.

Recommended: 2400px wide, WebP quality ~82, under 400KB.
To convert:  ffmpeg -i your-photo.jpg -vf "scale=2400:-2" -q:v 82 exterior-day.webp
