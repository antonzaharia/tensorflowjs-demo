require 'RMagick'
require 'random_name_generator'

5096.times do |i|
  rng = RandomNameGenerator.new
  index = i + 1
  img = Magick::ImageList.new("./clean/Image#{index}.jpg")

  text = Magick::Draw.new
  message = "#{rng.compose(2)} #{rng.compose(2)}"
  puts "Watermark #{message}"

  positions = [
    Magick::NorthWestGravity,
    Magick::NorthGravity,
    Magick::NorthEastGravity,
    Magick::WestGravity,
    Magick::CenterGravity,
    Magick::EastGravity,
    Magick::SouthWestGravity,
    Magick::SouthGravity,
    Magick::SouthEastGravity
  ]
  fonts = %w[arial verdana helvetica tahoma georgia garamond courier]

  img.annotate(text, 0, 0, 0, 0, message) do
    text.gravity = positions[rand(8)] # Text positioning
    text.pointsize = rand(1..9) * 10 # Font size
    text.fill = "rgba(0,0,0,#{rand(0.2..1).round(1)})" # Font color
    text.font_family = fonts[rand(6)] # Font file; needs to be absolute
    img.format = 'jpeg'
  end

  img.write("watermarked#{index}.jpg") # Destination image
end
