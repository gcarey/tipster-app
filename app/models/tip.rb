class Tip < ActiveRecord::Base
	belongs_to :user

  has_many :shares, dependent: :destroy
	has_many :recipients, :through => :shares, :source => :user

  belongs_to :originator, :class_name => "User"

  before_validation :add_url_protocol
  validates :link, presence: true, :format => URI::regexp(%w(http https))
  before_save :scrape_link

  serialize :images

  has_attached_file :image, :styles => { :full => "130x130#"}, :default_url => "paperclip-defaults/:style/missing.png"
  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/

  private

  # Scrape images, title, description
  def scrape_link
    uri = URI.parse(link)

    if File.extname(uri.path) =~ /^(.png|.gif|.jpg|.jpeg|.tiff)$/
      self.image = uri
      self.title = File.basename(uri.path)
      self.description = "Image link"
    else
      data = Grabbit.url(link)

      if data
        if data.title
          self.title = data.title
        else
          begin
            self.title = Mechanize.new.get(link).title
          rescue
            displaylink = link.sub(/^https?\:\/\//, '')
            self.title = displaylink
          end
        end
        self.description = data.description
        unless data.images.nil?
          $offset = 0
          # Run until an image is saved
          while self.image_file_name == nil
            # Attempt to extract file dimensions
            begin
              geometry = Paperclip::Geometry.from_file(data.images.drop($offset).first)
            rescue
              false
            else
              # Set file as image if dimensions meet reqs
              if geometry.width.to_i >= 130 && geometry.height.to_i >= 130
                self.image = URI.parse(data.images.drop($offset).first)
              end
            end
            # Move on to next image
            $offset +=1
            # If no more images to check, stop checking
            if data.images.drop($offset).first == nil
              ## And use first image
              #self.image = URI.parse(data.images.first)
              break
            end
          end 
        end
      else
        self.title = "shu"
      end
    end


  end

  def add_url_protocol
    unless self.link[/\Ahttp:\/\//] || self.link[/\Ahttps:\/\//]
      self.link = "http://#{self.link}"
    end
  end
end
