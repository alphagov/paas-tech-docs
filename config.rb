require 'govuk_tech_docs'

GovukTechDocs::SourceUrls.class_eval do
  def report_issue_url
    "mailto:gov-uk-paas-support@digital.cabinet-office.gov.uk?subject=Problem with GOV.UK PaaS technical documentation"
  end
end

GovukTechDocs.configure(self)

redirect "security.txt.html", to: "https://vdp.cabinetoffice.gov.uk/.well-known/security.txt"
redirect ".well-known/security.txt.html", to: "https://vdp.cabinetoffice.gov.uk/.well-known/security.txt"
