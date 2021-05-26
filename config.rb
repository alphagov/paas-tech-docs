require 'govuk_tech_docs'

GovukTechDocs::SourceUrls.class_eval do
  def report_issue_url
    "mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk?subject=Problem with GOV.UK PaaS technical documentation"
  end
end

GovukTechDocs.configure(self)

redirect "security.txt", to: "https://vdp.cabinetoffice.gov.uk/.well-known/security.txt"
page "security.txt", :content_type => 'text/html'
redirect ".well-known/security.txt", to: "https://vdp.cabinetoffice.gov.uk/.well-known/security.txt"
page ".well-known/security.txt", :content_type => 'text/html'
