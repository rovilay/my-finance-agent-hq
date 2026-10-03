import { Container } from '@/components/ui';
import Link from 'next/link';
import { Shield, Lock, Eye, Database, Mail } from 'lucide-react';
import { config } from '@/lib/config';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Container className="py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <div className="mb-8 pb-8 border-b border-neutral-200">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
              <h1 className="text-4xl font-display font-bold text-neutral-900">Privacy Policy</h1>
            </div>
            <p className="text-neutral-600 text-lg">Last Updated: October 2, 2026</p>
            <p className="text-neutral-700 mt-4">
              My Finance Agent HQ (“My Finance Agent HQ,” “we,” “us,” or “our”) respects your
              privacy. This Privacy Policy explains how we collect, use, store, disclose, retain,
              and protect personal information when you use our website, applications, software, and
              related services (collectively, the “Service”).
            </p>
            <p className="text-neutral-700 mt-4">
              The Service is a Canadian technology platform designed to help users understand
              Canadian tax concepts, organize and extract information from financial documents, and
              generate tax-related estimates, explanations, and calculations. The Service uses
              artificial intelligence (“AI”) and automated technologies. It does not file tax
              returns with the Canada Revenue Agency (“CRA”), does not access CRA systems or
              taxpayer accounts, and is not a government service.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">1. Who We Are</h2>
              </div>
              <p className="text-neutral-700">
                My Finance Agent HQ is a private technology service operating from Canada. The
                Service is not affiliated with, endorsed by, or acting on behalf of the CRA, the
                Government of Canada, Revenu Québec, or any other tax authority.
              </p>
              <p className="text-neutral-700 mt-3">
                Email: <a href={`mailto:${config.emails.privacy}`}>{config.emails.privacy}</a>
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  2. Applicable Privacy Laws
                </h2>
              </div>
              <p className="text-neutral-700">
                The Service is currently offered to users in Canada, other than residents of Quebec.
                We may change the geographic availability of the Service from time to time.
              </p>
              <p className="text-neutral-700 mt-3">
                We comply with applicable Canadian privacy legislation governing the collection,
                use, disclosure, retention, and protection of personal information, including the
                Personal Information Protection and Electronic Documents Act (“PIPEDA”) where
                applicable and other applicable provincial private-sector privacy legislation.
              </p>
              <p className="text-neutral-700 mt-3">
                If we later make the Service available to Quebec residents, we will review and
                update our privacy practices and this Policy before doing so to address applicable
                Quebec privacy requirements.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  3. What Is Personal Information?
                </h2>
              </div>
              <p className="text-neutral-700">
                Personal information generally means information about an identifiable individual.
                Because the Service may process tax and financial information, some of the
                information we handle may be sensitive. We use safeguards appropriate to the nature
                and sensitivity of the information.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  4. Information We Collect
                </h2>
              </div>

              <div className="space-y-4 text-neutral-700">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">4.1 Account Information</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      name, email address, and other information you provide when creating or
                      maintaining an account;
                    </li>
                    <li>authentication information and account credentials;</li>
                    <li>
                      information from third-party authentication providers, such as Google, if you
                      choose to sign in with them.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    4.2 Tax and Financial Information
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      tax forms, slips, receipts, invoices, and other financial or tax documents
                      that you choose to upload;
                    </li>
                    <li>
                      information you manually enter into the Service for tax education, estimation,
                      or calculation purposes;
                    </li>
                    <li>
                      income, expenses, deductions, credits, benefits, and other information
                      relevant to the calculations or explanations you request;
                    </li>
                    <li>
                      transaction information and other structured data extracted from documents you
                      provide;
                    </li>
                    <li>
                      information relating to Canadian tax residency, newcomer circumstances,
                      province of residence, or other facts you choose to provide.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    4.3 Information in Uploaded Documents
                  </h3>
                  <p>
                    Uploaded documents may contain personal information about you and other people,
                    including spouses, dependants, employees, contractors, or joint account holders.
                    We process documents to provide document extraction, organization, and
                    tax-related features.
                  </p>
                  <p className="mt-3">
                    We do not use uploaded documents to train a general-purpose AI model. We do not
                    provide users’ uploaded documents to AI providers for their own model-training
                    purposes.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    4.4 Technical and Usage Information
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      IP address, browser type, operating system, device information, and similar
                      technical information;
                    </li>
                    <li>
                      login dates and times, pages or screens viewed, features used, and
                      interactions with the Service;
                    </li>
                    <li>diagnostic, performance, security, and error information;</li>
                    <li>cookies and similar technologies, as described below.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">4.5 Communications</h3>
                  <p>
                    If you contact us, we may collect the contents of your communications and
                    information necessary to respond to your request, administer the Service, and
                    address support, security, or privacy issues.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  5. How We Collect Information
                </h2>
              </div>
              <p className="text-neutral-700">We may collect information:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-neutral-700">
                <li>
                  directly from you when you create an account, enter information, upload documents,
                  or contact us;
                </li>
                <li>
                  automatically through your use of the Service, including technical logs, cookies,
                  and similar technologies;
                </li>
                <li>
                  from third-party authentication providers when you choose to authenticate through
                  them;
                </li>
                <li>
                  from service providers that support the operation of the Service, where permitted
                  by law.
                </li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  6. How We Use Personal Information
                </h2>
              </div>
              <p className="text-neutral-700">
                We collect, use, and disclose personal information only for purposes that are
                appropriate in the circumstances and that are identified to you as required by
                applicable law.
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-neutral-700">
                <li>create, authenticate, and administer your account;</li>
                <li>provide document upload, extraction, organization, and related features;</li>
                <li>
                  provide tax education, explanations, estimates, and calculations requested by you;
                </li>
                <li>
                  use automated technologies to analyze information you provide and generate
                  responses or calculations;
                </li>
                <li>
                  maintain, troubleshoot, secure, and improve the functionality and reliability of
                  the Service;
                </li>
                <li>
                  detect and prevent fraud, abuse, unauthorized access, and security incidents;
                </li>
                <li>respond to support requests and communicate about the Service;</li>
                <li>comply with applicable legal obligations and respond to lawful requests;</li>
                <li>establish, exercise, or defend legal claims and enforce our agreements;</li>
                <li>
                  create aggregated or appropriately de-identified information for analytics,
                  service performance, and product improvement where permitted by law.
                </li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">7. AI Processing</h2>
              </div>
              <p className="text-neutral-700">
                The Service uses AI and automated technologies to support educational, extraction,
                and tax-estimation features. The AI may help summarize information, explain tax
                concepts, organize extracted information, identify potentially relevant tax
                considerations, and generate estimates or calculations based on information
                available to the Service.
              </p>
              <p className="text-neutral-700 mt-3">
                We do not use uploaded documents to train a general-purpose AI model. We do not
                provide users’ uploaded documents to AI providers for their own model-training
                purposes.
              </p>
              <p className="text-neutral-700 mt-3">
                For certain features, we may send limited data derived from your inputs to
                third-party AI service providers in order to provide the requested functionality.
                This may include information such as prompts, extracted text, selected fields, or
                calculations necessary to generate a response. We take steps to minimize the amount
                of information shared and to configure provider settings in a way that reduces
                unnecessary retention.
              </p>
              <p className="text-neutral-700 mt-3">
                Because AI-generated information can contain errors, omissions, or inaccurate
                interpretations, users should review information and calculations carefully and
                consult a qualified accountant, tax professional, or other appropriate professional
                before relying on the information for a tax filing or material financial decision.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  8. Storage and Retention
                </h2>
              </div>
              <p className="text-neutral-700">
                The Service is designed not to retain uploaded documents or personal information
                longer than reasonably necessary for the Service. However, information may be
                temporarily or account-associated stored where technically necessary to provide a
                requested feature, maintain your account, preserve your settings, troubleshoot the
                Service, maintain security, or comply with legal obligations.
              </p>
              <p className="text-neutral-700 mt-3">
                Where the Service provides an option to save information, saved information may
                remain associated with your account until you delete it, request deletion, close
                your account, or until the applicable retention period expires. Account-associated
                retention does not mean that all information disappears immediately when you close
                your account. Certain limited information may need to be retained for legal,
                security, fraud-prevention, dispute-resolution, or other legitimate purposes.
              </p>
              <p className="text-neutral-700 mt-3">
                Retention periods vary depending on the type of information, the purpose for which
                it was collected, and applicable legal requirements. We do not apply a blanket
                seven-year retention period to all user tax information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                9. Third-Party Service Providers
              </h2>
              <p className="text-neutral-700">
                We may use third-party providers for infrastructure, hosting, authentication,
                security, analytics, customer support, AI processing, and other technical services
                necessary to operate the Service.
              </p>
              <p className="text-neutral-700 mt-3">
                Service providers may process information on our behalf only to the extent
                reasonably necessary to provide their services and subject to appropriate
                contractual, confidentiality, and security measures.
              </p>
              <p className="text-neutral-700 mt-3">
                We do not sell your personal information for monetary consideration and do not
                disclose personal information to third parties for their independent marketing
                purposes unless permitted by applicable law and you have been given any choice or
                consent required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                10. International Processing
              </h2>
              <p className="text-neutral-700">
                Although My Finance Agent HQ operates from Canada, some third-party technology
                providers used by the Service may process information outside Canada. Where
                applicable, information processed outside Canada may be subject to the laws of the
                jurisdiction in which it is processed and may be accessible to courts,
                law-enforcement agencies, or regulators in that jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">11. Consent</h2>
              <p className="text-neutral-700">
                We seek meaningful consent for the collection, use, and disclosure of personal
                information where required by applicable law. Because tax and financial information
                can be sensitive, we may use express consent where appropriate.
              </p>
              <p className="text-neutral-700 mt-3">
                Before or at the time information is collected, we aim to provide clear information
                about what is being collected, why it is being collected, how it will be used, and
                with whom it may be shared, in accordance with applicable law.
              </p>
              <p className="text-neutral-700 mt-3">
                You may withdraw consent to certain uses or disclosures, subject to legal or
                contractual restrictions and reasonable notice. Withdrawal may affect our ability to
                provide particular features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                12. Information About Other Individuals
              </h2>
              <p className="text-neutral-700">
                If you upload or provide information about another individual, you represent that
                you are authorized to provide that information for the purposes described in this
                Policy or otherwise have a lawful basis to do so.
              </p>
              <p className="text-neutral-700 mt-3">
                You should not upload another person’s personal information if doing so would
                violate applicable law or that person’s privacy rights.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">13. Security Safeguards</h2>
              </div>
              <p className="text-neutral-700">
                We use administrative, technical, and physical safeguards appropriate to the
                sensitivity of the information we handle. Depending on the system, these may
                include:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-neutral-700">
                <li>encryption of information in transit;</li>
                <li>encryption of stored information where appropriate;</li>
                <li>secure password hashing and authentication controls;</li>
                <li>role-based access controls and least-privilege access;</li>
                <li>logging and monitoring for security events;</li>
                <li>security testing and vulnerability management;</li>
                <li>
                  confidentiality obligations and privacy/security training for personnel with
                  access to personal information.
                </li>
              </ul>
              <p className="text-neutral-700 mt-3">
                No method of storage or transmission is completely secure. We cannot guarantee
                absolute security, but we maintain safeguards designed to reduce the risk of
                unauthorized access, use, disclosure, alteration, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                14. Privacy and Security Breaches
              </h2>
              <p className="text-neutral-700">
                We maintain procedures designed to prevent, identify, contain, investigate, and
                respond to privacy and security incidents.
              </p>
              <p className="text-neutral-700 mt-3">
                If a breach involving personal information occurs, we will assess the incident and
                take the steps required by applicable law. Depending on the circumstances, this may
                include containing the incident, investigating its cause, maintaining required
                records, notifying the applicable privacy regulator, and notifying affected
                individuals or other parties where legally required.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                15. Cookies and Similar Technologies
              </h2>
              <p className="text-neutral-700">
                We may use cookies, local storage, pixels, software development kits (“SDKs”), and
                similar technologies to operate and secure the Service, remember preferences, and
                understand Service usage.
              </p>
              <p className="text-neutral-700 mt-3">Examples may include:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-neutral-700">
                <li>
                  strictly necessary technologies for authentication, session management, security,
                  and core functionality;
                </li>
                <li>functional technologies for preferences and settings;</li>
                <li>
                  analytics technologies for service performance, reliability, and usage analysis
                  where implemented.
                </li>
              </ul>
              <p className="text-neutral-700 mt-3">
                We will not use marketing or advertising technologies involving personal information
                unless implemented in accordance with applicable law and any required consent or
                choice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                16. Product Improvement and De-Identification
              </h2>
              <p className="text-neutral-700">
                We may use aggregated or appropriately de-identified information to understand
                service performance, diagnose problems, measure feature usage, and improve the
                Service, where permitted by law.
              </p>
              <p className="text-neutral-700 mt-3">
                We will take reasonable steps to ensure information described as de-identified is
                not reasonably capable of identifying an individual and will not attempt to
                re-identify such information except where permitted by law and necessary for
                legitimate purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                17. Your Privacy Rights
              </h2>
              <p className="text-neutral-700">
                Depending on applicable law, you may have the right to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-neutral-700">
                <li>request access to personal information we hold about you;</li>
                <li>request correction of inaccurate or incomplete personal information;</li>
                <li>
                  request information about how your information is collected, used, or disclosed;
                </li>
                <li>
                  withdraw consent to certain uses or disclosures, subject to applicable
                  limitations;
                </li>
                <li>request deletion or disposal where permitted by law;</li>
                <li>
                  make a privacy complaint or challenge our compliance with applicable privacy law;
                </li>
                <li>
                  request a copy or export of certain information where available and required by
                  law.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                18. Access, Correction, and Deletion Requests
              </h2>
              <p className="text-neutral-700">
                To make a privacy request, contact our Privacy Officer at{' '}
                <a href={`mailto:${config.emails.privacy}`}>{config.emails.privacy}</a>. We may need
                to verify your identity before providing access to personal information or making
                changes.
              </p>
              <p className="text-neutral-700 mt-3">
                We will respond within the time required by applicable law. If we cannot provide
                access or delete information, we will explain the applicable reason to the extent
                permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                19. Privacy Complaints
              </h2>
              <p className="text-neutral-700">
                If you have a concern about our privacy practices, please contact our Privacy
                Officer first. We will investigate and respond in accordance with our procedures and
                applicable law.
              </p>
              <p className="text-neutral-700 mt-3">
                You may also have the right to complain to the privacy regulator with jurisdiction
                over your circumstances, including the Office of the Privacy Commissioner of Canada
                or an applicable provincial privacy commissioner.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                20. Children’s Privacy
              </h2>
              <p className="text-neutral-700">
                The Service is not directed to children. We do not knowingly collect personal
                information from children in circumstances where doing so is prohibited by law. If
                you believe a child has provided personal information improperly, contact our
                Privacy Officer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                21. Third-Party Links
              </h2>
              <p className="text-neutral-700">
                The Service may contain links to third-party websites or services. We are not
                responsible for the privacy practices of third parties that we do not control. You
                should review their privacy policies before providing personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                22. Business Transfers
              </h2>
              <p className="text-neutral-700">
                If My Finance Agent HQ is involved in a merger, acquisition, financing,
                reorganization, sale of assets, or similar transaction, personal information may be
                transferred as part of that transaction, subject to applicable law and appropriate
                safeguards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                23. Changes to This Privacy Policy
              </h2>
              <p className="text-neutral-700">
                We may update this Privacy Policy to reflect changes to the Service, our privacy
                practices, technology, or applicable law. If we make a material change to how we
                collect, use, or disclose personal information, we will provide notice and obtain
                any consent required by law.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">24. Contact Us</h2>
              </div>
              <p className="text-neutral-700 mb-3">
                For privacy questions, requests, or complaints:
              </p>
              <div className="bg-neutral-50 rounded-lg p-4 text-neutral-700">
                <p>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${config.emails.privacy}`}>{config.emails.privacy}</a>
                </p>
                <p className="mt-2">
                  <strong>General support:</strong>{' '}
                  <a href="mailto:support@tryfinanceagenthq.com">support@tryfinanceagenthq.com</a>
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-200">
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
