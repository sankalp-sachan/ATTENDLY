import React from 'react';

const TermsContent = () => {
    return (
        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400">
            <div className="border-b dark:border-slate-800 pb-4">
                <h2 className="text-xl font-black text-slate-800 dark:text-white mb-1 uppercase tracking-tight">Terms and Conditions – Attendly</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mt-2">Last updated: January 30, 2026</p>
            </div>

            <p className="leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                Welcome to Attendly. By accessing or using the Attendly website, mobile application, or any related services (“Service”), you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.
            </p>

            <div className="space-y-4">
                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">1. Purpose of Attendly</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Attendly is a personal attendance tracking tool designed to help users individually record and manage their attendance data for personal reference and self-organization only.</li>
                        <li>Attendly does not represent, replace, or integrate with any official attendance system of schools, colleges, universities, or institutions.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">2. No Institutional Authorization</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Attendly is NOT authorized, affiliated, sponsored, or endorsed by any college, university, school, or educational institution.</li>
                        <li>Any attendance data recorded in Attendly is user-entered and self-maintained.</li>
                        <li>Attendly has no authority over official attendance records maintained by institutions.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">3. Personal Use Only</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Attendly is intended strictly for personal and informational use.</li>
                        <li>The data shown in the app cannot be used as official proof of attendance.</li>
                        <li>Users must not argue, dispute, or challenge teachers, faculty members, or institutions using data from Attendly.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">4. Accuracy of Data</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Attendly does not guarantee the accuracy, completeness, or correctness of attendance data.</li>
                        <li>Users are solely responsible for entering and maintaining their own data.</li>
                        <li>Any mismatch between Attendly data and official records is not the responsibility of Attendly.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">5. No Legal or Academic Claims</h3>
                    <p className="mb-2">Attendly cannot be used for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Academic disputes</li>
                        <li>Legal claims</li>
                        <li>Institutional complaints</li>
                        <li>Attendance-related arguments</li>
                    </ul>
                    <p className="mt-2 font-medium italic italic text-primary-500">The app is a support tool only, not an official authority.</p>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">6. User Responsibility</h3>
                    <p className="mb-2">By using Attendly, you agree that:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>You understand it is not an official attendance system</li>
                        <li>You will use it ethically and responsibly</li>
                        <li>You will not misuse the app to misrepresent attendance to any authority</li>
                    </ul>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">7. Limitation of Liability</h3>
                    <p className="mb-2">Attendly, its founders, developers, or team members shall not be liable for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Academic loss or penalties</li>
                        <li>Disciplinary actions by institutions</li>
                        <li>Disputes arising from attendance records</li>
                        <li>Any direct or indirect damages resulting from app usage</li>
                    </ul>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">8. Changes to Terms</h3>
                    <p>Attendly reserves the right to update or modify these Terms and Conditions at any time. Continued use of the Service after changes implies acceptance of the updated terms.</p>
                </section>

                <section>
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-xs mb-2">9. Acceptance of Terms</h3>
                    <p className="mb-2">By using Attendly, you acknowledge that:</p>
                    <ul className="list-disc pl-5 space-y-1 font-bold text-slate-700 dark:text-slate-200">
                        <li>You have read and understood these Terms</li>
                        <li>You agree to all conditions stated above</li>
                        <li>You accept that Attendly is only a personal attendance tracker</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default TermsContent;
