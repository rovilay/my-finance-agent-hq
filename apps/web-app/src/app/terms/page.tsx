import { Container } from '@/components/ui';
import Link from 'next/link';
import { FileText, AlertTriangle, Shield, Mail } from 'lucide-react';
import { config } from '@/lib/config';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Container className="py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <div className="mb-8 pb-8 border-b border-neutral-200">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-primary-600" />
              <h1 className="text-4xl font-display font-bold text-neutral-900">Terms of Service</h1>
            </div>
            <p className="text-neutral-600 text-lg">Last Updated: October 2, 2026</p>
            <p className="text-neutral-700 mt-4">
              These Terms of Service (“Terms”) form a legal agreement between you and My Finance
              Agent HQ (“My Finance Agent HQ,” “we,” “us,” or “our”) governing your access to and
              use of our website, applications, software, and related services (collectively, the
              “Service”).
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                1. Acceptance of These Terms
              </h2>
              <p className="text-neutral-700 mb-3">
                By creating an account, accessing, or using the Service, you acknowledge that you
                have read and understood these Terms and agree to be bound by them and by our
                Privacy Policy. If you do not agree to these Terms, you must not access or use the
                Service.
              </p>
              <p className="text-neutral-700">
                If you are using the Service on behalf of another person or organization, you
                represent that you have authority to bind that person or organization to these
                Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                2. Eligibility and Geographic Availability
              </h2>
              <p className="text-neutral-700">
                The Service is currently offered in Canada, except to residents of Quebec. We may
                restrict or change geographic availability at any time.
              </p>
              <p className="text-neutral-700 mt-3">
                You may use the Service only if you are legally capable of entering into a binding
                agreement under applicable law. If you are under the age required to enter into a
                binding contract in your jurisdiction, you may use the Service only with the
                involvement and consent of a parent or legal guardian, where permitted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                3. Description of the Service
              </h2>
              <p className="text-neutral-700 mb-3">
                My Finance Agent HQ is a free technology and learning tool intended to help users
                better understand Canadian tax concepts, organize and interpret information relevant
                to personal tax matters, and ask questions through an AI-powered tax assistant.
              </p>
              <p className="text-neutral-700 mb-3">
                Depending on the features available, the Service may allow you to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>
                  upload financial or tax-related documents for automated extraction and
                  organization;
                </li>
                <li>enter financial and tax information manually;</li>
                <li>receive explanations of Canadian tax concepts;</li>
                <li>generate estimates or calculations based on information you provide;</li>
                <li>
                  identify information that may be relevant to deductions, credits, benefits, or
                  other tax considerations;
                </li>
                <li>
                  use an AI-powered tax assistant to ask questions about Canadian tax concepts and
                  receive educational or informational responses.
                </li>
              </ul>
              <p className="text-neutral-700 mt-3">
                The Service is not a tax return filing service. It does not submit tax returns to
                the Canada Revenue Agency (“CRA”), does not use CRA NETFILE, does not access your
                CRA account, does not access CRA’s Auto-fill My Return service, and does not act as
                your representative before the CRA.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-warning" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  4. Important Tax and AI Disclaimer
                </h2>
              </div>
              <div className="bg-warning-light border border-warning rounded-lg p-6 text-neutral-900">
                <p className="font-semibold mb-3">Important:</p>
                <p className="mb-3">
                  The Service is an educational and informational tool. It is not a substitute for
                  professional tax preparation, accounting, legal, or financial advice.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Information generated by the Service may be inaccurate, incomplete, outdated, or
                    unsuitable for your particular circumstances.
                  </li>
                  <li>
                    Tax laws, administrative policies, rates, thresholds, credits, and eligibility
                    requirements can change and may differ based on your province or territory, tax
                    year, and individual circumstances.
                  </li>
                  <li>
                    You are responsible for independently reviewing the information provided by the
                    Service before relying on it, filing a tax return, claiming a deduction or
                    credit, making a financial decision, or taking any other action.
                  </li>
                  <li>
                    Where your circumstances are complex or involve foreign income or assets,
                    immigration or tax residency issues, self-employment, corporations, trusts,
                    multiple residences, tax treaties, or other specialized matters, you should
                    consult a qualified Canadian tax professional.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  5. No Professional Relationship
                </h2>
              </div>
              <p className="text-neutral-700">
                Use of the Service does not create a professional-client, accountant-client,
                lawyer-client, financial-advisor-client, or tax-preparer-client relationship between
                you and My Finance Agent HQ, or between you and any AI system made available through
                the Service.
              </p>
              <p className="text-neutral-700 mt-3">
                Unless expressly stated in a separate written agreement, My Finance Agent HQ does
                not provide professional tax, accounting, legal, or financial advisory services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                6. No Government Affiliation
              </h2>
              <p className="text-neutral-700">
                My Finance Agent HQ is an independent private technology service. It is not
                affiliated with, endorsed by, sponsored by, or acting on behalf of the Canada
                Revenue Agency, the Government of Canada, Revenu Québec, or any provincial or
                territorial tax authority.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                7. AI and Automated Technologies
              </h2>
              <p className="text-neutral-700">
                The Service uses artificial intelligence, machine learning, automated document
                extraction, optical character recognition, rules-based processing, and other
                automated technologies.
              </p>
              <p className="text-neutral-700 mt-3">
                The Service includes an AI-powered tax assistant that allows users to ask questions
                about Canadian tax concepts and receive automated responses. The assistant is
                intended for general educational and informational purposes and is not a substitute
                for individualized advice from a qualified tax professional.
              </p>
              <p className="text-neutral-700 mt-3">
                The Service currently uses third-party AI providers for certain functionality.
                AI-generated outputs may contain errors, hallucinations, omissions, incorrect
                classifications, or inaccurate calculations. The Service may also incorrectly
                extract information from a document.
              </p>
              <p className="text-neutral-700 mt-3">
                You should treat AI-generated information as a starting point for learning and
                review, not as a definitive statement of your tax obligations or entitlements.
              </p>
              <p className="text-neutral-700 mt-3">
                Our Privacy Policy describes how personal information is handled in connection with
                AI processing and third-party service providers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                8. Account Registration and Security
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>
                  You must provide information that is accurate and reasonably complete when
                  creating an account.
                </li>
                <li>
                  You are responsible for maintaining the confidentiality of your account
                  credentials.
                </li>
                <li>
                  You must promptly notify us if you believe your account has been accessed without
                  authorization.
                </li>
                <li>
                  You are responsible for activities conducted through your account, except to the
                  extent caused by our failure to use reasonable security safeguards.
                </li>
                <li>
                  You must not allow another person to use your account in a manner that violates
                  these Terms.
                </li>
              </ul>
              <p className="text-neutral-700 mt-3">
                We may require you to update account information where reasonably necessary for
                security, legal compliance, or operation of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                9. User Content and Uploaded Documents
              </h2>
              <p className="text-neutral-700">
                You retain ownership of documents, data, and other content that you upload or submit
                to the Service (“User Content”). We do not acquire ownership of your User Content
                merely because you use the Service.
              </p>
              <p className="text-neutral-700 mt-3">
                You grant us a limited, non-exclusive, worldwide, royalty-free license to host,
                store, reproduce, process, extract, analyze, and otherwise use User Content only as
                reasonably necessary to operate, secure, maintain, and provide the Service and as
                otherwise described in our Privacy Policy or permitted by applicable law.
              </p>
              <p className="text-neutral-700 mt-3">
                You represent and warrant that you have the rights, permissions, or other lawful
                basis necessary to upload and process User Content through the Service.
              </p>
              <p className="text-neutral-700 mt-3">
                You should not upload another person’s personal information unless you are
                authorized to do so or otherwise have a lawful basis to provide it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                10. User Responsibilities for Accuracy
              </h2>
              <p className="text-neutral-700">
                You are responsible for the accuracy, completeness, and currency of information you
                provide to the Service.
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-neutral-700">
                <li>review extracted information for accuracy;</li>
                <li>verify calculations and estimates before relying on them;</li>
                <li>
                  confirm that documents were correctly interpreted and that relevant information
                  was not omitted;
                </li>
                <li>
                  independently confirm tax rules and eligibility requirements that apply to you;
                </li>
                <li>obtain professional advice where appropriate.</li>
              </ul>
              <p className="text-neutral-700 mt-3">
                The Service does not independently verify the truth, completeness, or legal status
                of the information you provide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                11. Newcomer and Tax-Residency Information
              </h2>
              <p className="text-neutral-700">
                The Service may provide educational information relevant to newcomers to Canada.
                Canadian tax treatment may depend on factors including the date you became a
                resident of Canada for income tax purposes, residential ties, immigration
                circumstances, income earned inside and outside Canada, foreign property, tax
                treaties, and other individual facts.
              </p>
              <p className="text-neutral-700 mt-3">
                The Service does not make a binding determination of your Canadian tax residency and
                does not guarantee that an estimate or explanation applies to your circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">12. Acceptable Use</h2>
              <p className="text-neutral-700">You agree not to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-neutral-700">
                <li>use the Service for unlawful, fraudulent, or deceptive purposes;</li>
                <li>
                  upload malicious code, viruses, malware, or files designed to interfere with the
                  Service;
                </li>
                <li>
                  attempt to gain unauthorized access to the Service, another user’s account, or our
                  systems;
                </li>
                <li>
                  probe, scan, or test the vulnerability of the Service without our prior written
                  authorization;
                </li>
                <li>
                  reverse engineer, decompile, disassemble, or attempt to derive source code from
                  the Service, except to the extent such restriction is prohibited by law;
                </li>
                <li>
                  circumvent security, rate limits, access controls, or other technical
                  restrictions;
                </li>
                <li>
                  use automated means to scrape or systematically extract Service content except
                  where expressly authorized;
                </li>
                <li>
                  use the Service to infringe another person’s intellectual property, privacy, or
                  other rights;
                </li>
                <li>
                  upload personal information about another person without authorization or another
                  lawful basis;
                </li>
                <li>use the Service to harass, threaten, abuse, or harm another person;</li>
                <li>interfere with another user’s use of the Service;</li>
                <li>misrepresent the Service as a CRA, government, or professional tax service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                13. Intellectual Property
              </h2>
              <p className="text-neutral-700">
                Except for User Content, My Finance Agent HQ and its licensors own all rights,
                title, and interest in the Service, including its software, interfaces, designs,
                branding, trademarks, text, graphics, documentation, workflows, databases, and other
                content.
              </p>
              <p className="text-neutral-700 mt-3">
                Subject to these Terms, we grant you a limited, non-exclusive, non-transferable,
                revocable right to access and use the Service for your personal, lawful purposes.
              </p>
              <p className="text-neutral-700 mt-3">
                You may not copy, reproduce, distribute, sell, license, modify, or create derivative
                works of the Service except as expressly permitted by us or applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">14. Feedback</h2>
              <p className="text-neutral-700">
                If you voluntarily provide suggestions, ideas, feedback, or recommendations
                concerning the Service, you grant us a non-exclusive, worldwide, royalty-free right
                to use and incorporate that feedback for purposes of improving or developing the
                Service, without compensation or attribution, provided that we do not use personal
                information contained in the feedback in a manner inconsistent with our Privacy
                Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                15. Third-Party Services
              </h2>
              <p className="text-neutral-700">
                The Service may rely on or integrate with third-party technologies and services,
                including AI, hosting, authentication, analytics, security, and communications
                providers.
              </p>
              <p className="text-neutral-700 mt-3">
                Third-party services may have their own terms and privacy policies. Your use of a
                third-party service may be subject to those terms. We are not responsible for the
                independent acts or omissions of third parties that we do not control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                16. Service Availability and Changes
              </h2>
              <p className="text-neutral-700">
                We may modify, suspend, restrict, or discontinue all or part of the Service at any
                time, including for maintenance, security, legal compliance, technical reasons, or
                product development.
              </p>
              <p className="text-neutral-700 mt-3">
                We do not guarantee that the Service will always be available, uninterrupted,
                error-free, or compatible with every device or software environment.
              </p>
              <p className="text-neutral-700 mt-3">
                Because the Service is free, we do not promise that any particular feature will
                remain available indefinitely.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">17. Free Service</h2>
              <p className="text-neutral-700">
                The Service is currently provided without a user fee. We may introduce paid
                features, subscriptions, or other charges in the future. If we introduce paid
                services, we will provide any pricing and contractual disclosures required by
                applicable law before charging you.
              </p>
              <p className="text-neutral-700 mt-3">
                Nothing in this section limits any consumer rights that may apply to a future paid
                service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">18. Privacy</h2>
              <p className="text-neutral-700">
                Our collection, use, disclosure, retention, and protection of personal information
                are governed by our Privacy Policy, which forms part of these Terms.
              </p>
              <p className="text-neutral-700 mt-3">
                You should read the Privacy Policy before using the Service.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-warning" />
                <h2 className="text-2xl font-semibold text-neutral-900">19. Disclaimers</h2>
              </div>
              <p className="text-neutral-700">
                To the maximum extent permitted by applicable law, the Service is provided on an “AS
                IS” and “AS AVAILABLE” basis.
              </p>
              <p className="text-neutral-700 mt-3">
                We do not warrant that the Service or its outputs will be accurate, complete,
                current, reliable, uninterrupted, secure, or error-free, or that any particular tax
                outcome, deduction, credit, benefit, refund, or amount owing will result from use of
                the Service.
              </p>
              <p className="text-neutral-700 mt-3">
                We do not warrant that information generated by the Service will reflect the most
                recent legislation, regulations, CRA administrative positions, court decisions, or
                other developments at the time you use it.
              </p>
              <p className="text-neutral-700 mt-3">
                Nothing in these Terms excludes or limits any warranty, condition, representation,
                right, or remedy that cannot lawfully be excluded or limited under applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                20. Limitation of Liability
              </h2>
              <p className="text-neutral-700">
                To the maximum extent permitted by applicable law, My Finance Agent HQ will not be
                liable for indirect, incidental, special, consequential, or punitive damages arising
                out of or relating to your use of, or inability to use, the Service.
              </p>
              <p className="text-neutral-700 mt-3">
                Without limiting the foregoing, and to the maximum extent permitted by law, we are
                not responsible for losses arising from inaccurate, incomplete, or outdated
                information supplied by you; your failure to review extracted information or
                AI-generated outputs; tax penalties, interest, or assessments resulting from your
                use of the Service; or your failure to obtain professional advice where appropriate.
              </p>
              <p className="text-neutral-700 mt-3">
                Because the Service is currently free, our aggregate liability for claims arising
                directly from the Service will not exceed CAD $100, to the maximum extent permitted
                by applicable law.
              </p>
              <p className="text-neutral-700 mt-3">
                Nothing in these Terms limits or excludes liability to the extent that doing so is
                prohibited by applicable law, including liability that cannot lawfully be excluded
                for fraud, intentional misconduct, or other non-excludable liability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">21. Indemnification</h2>
              <p className="text-neutral-700">
                To the maximum extent permitted by applicable law, you agree to indemnify and hold
                harmless My Finance Agent HQ and its officers, directors, employees, and contractors
                from third-party claims, losses, liabilities, and reasonable costs arising from your
                unlawful use of the Service, your violation of these Terms, or your infringement of
                another person’s rights through User Content.
              </p>
              <p className="text-neutral-700 mt-3">
                This section does not require you to indemnify us for losses caused by our own
                negligence, willful misconduct, or other conduct for which liability cannot lawfully
                be shifted to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                22. Suspension and Termination
              </h2>
              <p className="text-neutral-700">
                You may stop using the Service at any time and may request deletion of your account
                in accordance with the Privacy Policy.
              </p>
              <p className="text-neutral-700 mt-3">
                We may suspend or terminate access to the Service where reasonably necessary to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-neutral-700">
                <li>protect the security or integrity of the Service;</li>
                <li>prevent fraud, abuse, or unlawful activity;</li>
                <li>address a material violation of these Terms;</li>
                <li>comply with applicable law or a lawful order;</li>
                <li>discontinue the Service.</li>
              </ul>
              <p className="text-neutral-700 mt-3">
                Where reasonably practicable and appropriate, we will provide notice before
                termination or suspension. Immediate action may be taken where necessary for
                security, fraud prevention, legal compliance, or protection of users or the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                23. Effect of Termination
              </h2>
              <p className="text-neutral-700">
                Upon termination, your right to access the Service ends. Our Privacy Policy governs
                the handling, deletion, and retention of personal information and User Content after
                termination.
              </p>
              <p className="text-neutral-700 mt-3">
                Sections that by their nature should survive termination, including intellectual
                property, disclaimers, limitations of liability, indemnification, and
                dispute-related provisions, will survive to the extent permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                24. Changes to These Terms
              </h2>
              <p className="text-neutral-700">
                We may update these Terms from time to time. The “Last Updated” date will identify
                the most recent version.
              </p>
              <p className="text-neutral-700 mt-3">
                If we make a material change that affects your rights or obligations, we will
                provide notice through the Service, by email, or by another reasonable method. Where
                applicable law requires express acceptance of a material change, we will obtain that
                acceptance.
              </p>
              <p className="text-neutral-700 mt-3">
                Your continued use of the Service after a change becomes effective constitutes
                acceptance, to the extent permitted by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">25. Governing Law</h2>
              <p className="text-neutral-700">
                These Terms are governed by and construed in accordance with the laws of the
                Province of Ontario and the federal laws of Canada applicable therein, without
                regard to conflict-of-laws principles.
              </p>
              <p className="text-neutral-700 mt-3">
                If the Service is made available in another Canadian province or territory,
                mandatory consumer protection and other applicable laws of that jurisdiction may
                apply to users located there.
              </p>
              <p className="text-neutral-700 mt-3">
                Nothing in these Terms prevents you from exercising rights or remedies that cannot
                lawfully be excluded under applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                26. Dispute Resolution
              </h2>
              <p className="text-neutral-700">
                Before starting formal legal proceedings, you and My Finance Agent HQ agree to make
                reasonable efforts to resolve a dispute through good-faith communication.
              </p>
              <p className="text-neutral-700 mt-3">
                Nothing in these Terms prevents a user from filing a complaint with a privacy
                regulator, consumer protection authority, or other governmental body, or from
                exercising a statutory right to bring a claim before a court or tribunal where that
                right cannot lawfully be restricted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                27. General Contract Terms
              </h2>
              <p className="text-neutral-700">
                If any provision of these Terms is found to be invalid or unenforceable, the
                remaining provisions will remain in effect to the extent permitted by law.
              </p>
              <p className="text-neutral-700 mt-3">
                Our failure to enforce a provision is not a waiver of our right to enforce it later.
              </p>
              <p className="text-neutral-700 mt-3">
                These Terms, together with the Privacy Policy and any additional terms expressly
                incorporated into the Service, constitute the agreement between you and My Finance
                Agent HQ regarding the Service.
              </p>
              <p className="text-neutral-700 mt-3">
                You may not assign your rights or obligations under these Terms without our prior
                written consent, except where assignment is permitted by applicable law. We may
                assign these Terms in connection with a merger, acquisition, reorganization, or sale
                of substantially all of our assets, subject to applicable law.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">28. Contact Us</h2>
              </div>
              <p className="text-neutral-700 mb-3">
                Questions about these Terms may be directed to:
              </p>
              <div className="bg-neutral-50 rounded-lg p-4 text-neutral-700">
                <p>
                  <strong>Legal Contact:</strong>{' '}
                  <a href={`mailto:${config.emails.legal}`}>{config.emails.legal}</a>
                </p>
                <p className="mt-2">
                  <strong>General Support:</strong>{' '}
                  <a href={`mailto:${config.emails.support}`}>{config.emails.support}</a>
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
