
const Newsfeed = () => {
    return (
        <div className="bg-white py-20">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Insights</p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">News and ideas for better building design.</h1>
                    <p className="mt-6 text-lg leading-8 text-slate-600">Stay up to date with architectural trends, engineering innovation, and practical advice for your next project.</p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-3">
                    {[
                        {
                            title: 'Sustainable structure strategies',
                            summary: 'How efficient engineering reduces cost and long-term maintenance.',
                        },
                        {
                            title: 'Modern residential planning',
                            summary: 'Designing homes that feel both welcoming and highly functional.',
                        },
                        {
                            title: 'Permitting made simple',
                            summary: 'A step-by-step guide to avoiding common approval delays.',
                        },
                    ].map((item, index) => (
                        <article key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
                            <h2 className="text-2xl font-semibold text-slate-900">{item.title}</h2>
                            <p className="mt-4 text-sm leading-7 text-slate-600">{item.summary}</p>
                            <a href="/contact" className="mt-6 inline-flex text-sm font-semibold text-cyan-600 hover:text-cyan-500">Read article →</a>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Newsfeed
