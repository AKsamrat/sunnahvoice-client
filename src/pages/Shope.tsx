
const Shope = () => {
    return (
        <div className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Projects</p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Featured work across architecture, engineering, and building execution.</h1>
                    <p className="mt-6 text-lg leading-8 text-slate-600">Explore a selection of design-forward projects, from residential remodels to large commercial developments.</p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-3">
                    {[
                        {
                            title: 'Riverfront Offices',
                            subtitle: 'Commercial campus design',
                            badge: 'Architecture + Engineering',
                        },
                        {
                            title: 'Urban Loft Residences',
                            subtitle: 'Adaptive reuse & interiors',
                            badge: 'Residential design',
                        },
                        {
                            title: 'Industrial Warehouse',
                            subtitle: 'Structural optimization',
                            badge: 'Engineering solutions',
                        },
                    ].map((project, index) => (
                        <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
                            <div className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">{project.badge}</div>
                            <h2 className="mt-6 text-2xl font-semibold text-slate-900">{project.title}</h2>
                            <p className="mt-4 text-sm leading-7 text-slate-600">{project.subtitle}</p>
                            <a href="/contact" className="mt-6 inline-flex text-sm font-semibold text-cyan-600 hover:text-cyan-500">Learn more →</a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Shope
