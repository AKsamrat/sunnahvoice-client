import { FaClipboardList, FaLandmark, FaIndustry, FaChartLine } from 'react-icons/fa'

const BusinessValue = () => {
    return (
        <div className="bg-slate-50 py-20">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Services</p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Architecture and engineering services tailored for every stage of your building.</h1>
                    <p className="mt-6 text-lg leading-8 text-slate-600">We combine architectural design, structural engineering, permitting support, and construction coordination into a single, cohesive service experience.</p>
                </div>

                <div className="mt-16 grid gap-8 lg:grid-cols-2">
                    {[
                        {
                            icon: <FaClipboardList size={24} className="text-cyan-500" />,
                            title: 'Schematic & design development',
                            description: 'Concept sketches, floor plans, and visual studies that shape the project vision.',
                        },
                        {
                            icon: <FaLandmark size={24} className="text-cyan-500" />,
                            title: 'Architectural documentation',
                            description: 'Detailed drawings and specifications ready for permitting and construction.',
                        },
                        {
                            icon: <FaIndustry size={24} className="text-cyan-500" />,
                            title: 'Structural engineering',
                            description: 'Load analysis, material selection, and responsive design for safety and efficiency.',
                        },
                        {
                            icon: <FaChartLine size={24} className="text-cyan-500" />,
                            title: 'Project guidance',
                            description: 'Budget review, contractor coordination, and quality monitoring from start to finish.',
                        },
                    ].map((item, index) => (
                        <div key={index} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">{item.icon}</div>
                            <h2 className="mt-6 text-2xl font-semibold text-slate-900">{item.title}</h2>
                            <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 grid gap-8 lg:grid-cols-3">
                    <div className="rounded-3xl bg-slate-950 p-8 text-white">
                        <p className="text-sm uppercase tracking-[0.28em] text-cyan-400">70+</p>
                        <p className="mt-3 text-3xl font-semibold">Completed projects</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950 p-8 text-white">
                        <p className="text-sm uppercase tracking-[0.28em] text-cyan-400">15 yrs</p>
                        <p className="mt-3 text-3xl font-semibold">Industry experience</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950 p-8 text-white">
                        <p className="text-sm uppercase tracking-[0.28em] text-cyan-400">Trusted partners</p>
                        <p className="mt-3 text-3xl font-semibold">Developers, contractors, owners</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BusinessValue
