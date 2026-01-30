import React from 'react';

const TermsContent = () => {
    return (
        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400">
            <div className="border-b dark:border-slate-800 pb-4">
                <h2 className="text-xl font-black text-slate-800 dark:text-white mb-1 uppercase tracking-tight">Terms and Conditions – Attendly</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mt-2">Last updated: January 30, 2026</p>
            </div>

            <p className="leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                Welcome to Attendly. By accessing or using the Attendly website, mobile application, or any related services (“Service”), you agree to comply with and be bound by the following Terms and Conditions. If you do not agree, please do not use the Service.
            </p>

            <div className="space-y-4">
                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">1. Purpose of Attendly</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Attendly is a personal attendance tracking tool designed to help users individually record and manage their attendance data for personal reference only.</li>
                        <li>Attendly does not represent, replace, or integrate with any official attendance system of schools, colleges, universities, or institutions.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">2. No Institutional Authorization</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Attendly is not authorized, affiliated, sponsored, or endorsed by any college, university, school, or educational institution.</li>
                        <li>Attendance data displayed in Attendly is self-entered by users and may not match official records.</li>
                        <li>Attendly has no control or authority over institutional attendance systems.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">3. Personal Use Only</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Attendly is intended strictly for personal and informational use.</li>
                        <li>The app cannot be used as official proof of attendance.</li>
                        <li>Users must not use Attendly to argue, dispute, or challenge teachers, professors, faculty members, or institutions.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">4. Accuracy of Data</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Attendly does not guarantee accuracy, completeness, or correctness of attendance data.</li>
                        <li>Users are solely responsible for entering, reviewing, and maintaining their data.</li>
                        <li>Any discrepancy between Attendly data and official records is entirely the user’s responsibility.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">5. No Academic or Legal Claims</h3>
                    <p className="mb-2">Attendly must not be used for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Academic disputes</li>
                        <li>Legal claims</li>
                        <li>Complaints against institutions</li>
                        <li>Arguments with teachers or faculty</li>
                    </ul>
                    <p className="mt-2 font-medium italic text-primary-500">The app serves only as a personal support tool, not an authoritative source.</p>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">6. Developer Disclaimer & Dispute Responsibility</h3>
                    <ul className="list-disc pl-5 space-y-1 font-medium">
                        <li>The developers, founders, owners, and team members of Attendly shall not be responsible or liable for any disputes, claims, misunderstandings, or conflicts arising from the use of the Service.</li>
                        <li>Attendly must not be used to support or justify arguments with teachers, professors, faculty members, or educational institutions.</li>
                        <li>Any claims, disputes, or arguments with teachers or authorities based on Attendly data are solely the responsibility of the user.</li>
                        <li>The Attendly team will not participate in, support, or mediate any such disputes.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">7. User Responsibility</h3>
                    <p className="mb-2">By using Attendly, you acknowledge and agree that:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Attendly is not an official attendance system</li>
                        <li>You will use the Service ethically and responsibly</li>
                        <li>You will not misuse the app to misrepresent attendance or raise institutional claims</li>
                    </ul>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">8. Limitation of Liability</h3>
                    <p className="mb-2 text-red-500 font-bold">To the maximum extent permitted by law, Attendly and its developers shall not be liable for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Academic penalties or attendance shortages</li>
                        <li>Disciplinary actions taken by institutions</li>
                        <li>Loss of marks, grades, or opportunities</li>
                        <li>Direct, indirect, incidental, or consequential damages arising from app usage</li>
                    </ul>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">9. Changes to Terms</h3>
                    <p>Attendly reserves the right to modify these Terms and Conditions at any time. Continued use of the Service after updates indicates acceptance of the revised terms.</p>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">10. Acceptance of Terms</h3>
                    <p className="mb-2">By accessing or using Attendly, you confirm that:</p>
                    <ul className="list-disc pl-5 space-y-1 font-black text-slate-700 dark:text-slate-200">
                        <li>You have read and understood these Terms and Conditions</li>
                        <li>You agree to be bound by them</li>
                        <li>You accept that Attendly is only a personal attendance tracking tool</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default TermsContent;
