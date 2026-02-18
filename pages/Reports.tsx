import React from 'react';
import Card from '../components/ui/Card';
import { useCrm } from '../hooks/useCrm';
import { ICONS, CHART_COLORS } from '../constants';
import { Lead } from '../types';

const KpiCard = ({ title, value, change, icon }: { title: string; value: string; change?: string, icon: React.ReactNode }) => (
    <Card className="p-0">
        <div className="p-6">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <div className="text-gray-400">{icon}</div>
            </div>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {change && <p className="text-sm text-green-500 mt-1">{change}</p>}
        </div>
    </Card>
);

const SalesFunnel = ({ leads, stages }: { leads: Lead[]; stages: string[] }) => {
    const stageCounts = stages.map(stage => ({
        stage,
        count: leads.filter(lead => stages.slice(0, stages.indexOf(stage) + 1).includes(lead.status) || lead.status === 'Won').length,
    }));
    const maxCount = Math.max(...stageCounts.map(s => s.count), 1);

    return (
        <Card title="Sales Conversion Funnel">
            <div className="space-y-2 mt-4">
                {stageCounts.map(({ stage, count }, index) => (
                    <div key={stage} className="flex items-center">
                        <div className="w-28 text-sm text-gray-600 text-right pr-4">{stage}</div>
                        <div className="flex-1 bg-gray-100 rounded">
                            <div
                                className="h-8 rounded text-white text-sm flex items-center justify-between px-2"
                                style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                            >
                                <span>{count}</span>
                                {index > 0 && stageCounts[index - 1].count > 0 && (
                                    <span className="text-xs opacity-80">{((count / stageCounts[index - 1].count) * 100).toFixed(0)}%</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

const LeadsBySourceChart = ({ leads }: { leads: Lead[] }) => {
    const sourceCounts: { [key: string]: number } = leads.reduce((acc, lead) => {
        acc[lead.source] = (acc[lead.source] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const sortedSources = Object.entries(sourceCounts).sort(([, a], [, b]) => b - a);
    const totalLeads = leads.length;

    let cumulativePercent = 0;

    return (
        <Card title="Leads by Source">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative flex items-center justify-center h-48">
                    {totalLeads > 0 ? (
                        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 32 32">
                            {sortedSources.map(([source, count], index) => {
                                const percent = (count / totalLeads) * 100;
                                const dashArray = `${percent} 100`;
                                const dashOffset = -cumulativePercent;
                                cumulativePercent += percent;
                                return (
                                    <circle
                                        key={source}
                                        cx="16"
                                        cy="16"
                                        r="16"
                                        fill="transparent"
                                        stroke={CHART_COLORS[index % CHART_COLORS.length]}
                                        strokeWidth="8"
                                        strokeDasharray={dashArray}
                                        strokeDashoffset={dashOffset}
                                    />
                                );
                            })}
                        </svg>
                    ) : (
                        <div className="text-gray-400 text-sm">No data available</div>
                    )}
                    <div className="absolute flex flex-col items-center pointer-events-none">
                        <span className="text-2xl font-bold bg-white px-1 rounded bg-opacity-75">{totalLeads}</span>
                    </div>
                </div>
                <div>
                    <ul className="space-y-2">
                        {sortedSources.map(([source, count], index) => (
                            <li key={source} className="flex items-center text-sm">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></span>
                                <span className="font-medium text-gray-700">{source}:</span>
                                <span className="ml-auto text-gray-600">{count} ({((count / totalLeads) * 100).toFixed(0)}%)</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Card>
    );
};


const LeadGenerationChart = ({ leads }: { leads: Lead[] }) => {
    const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return d.toLocaleString('default', { month: 'short', year: '2-digit' });
    }).reverse();

    const data = months.map(month => {
        return {
            month,
            count: leads.filter(l => {
                const d = new Date(l.created_at);
                return d.toLocaleString('default', { month: 'short', year: '2-digit' }) === month;
            }).length
        };
    });

    const maxCount = Math.max(...data.map(d => d.count), 1);

    return (
        <Card title="Lead Generation Over Time">
            <div className="h-64 flex items-end gap-2 justify-between px-4 pb-2 border-b border-l border-gray-200 mt-4 relative">
                {data.map((d, i) => (
                    <div key={d.month} className="flex flex-col items-center justify-end h-full w-full group relative">
                        <div
                            className="w-full max-w-[40px] bg-primary-500 rounded-t hover:bg-primary-600 transition-all relative"
                            style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: '4px' }}
                        >
                            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                {d.count}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{d.month}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};
const Reports: React.FC = () => {
    const { leads, settings } = useCrm();
    const dealsWon = leads.filter(l => l.status === 'Won').length;
    const conversionRate = leads.length > 0 ? ((dealsWon / leads.length) * 100).toFixed(1) + '%' : '0%';

    const totalWonValue = leads.filter(l => l.status === 'Won').reduce((sum, lead) => sum + (lead.deal_value || 0), 0);
    const avgDealValue = dealsWon > 0 ? totalWonValue / dealsWon : 0;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard title="Total Leads" value={leads.length.toString()} icon={ICONS.leadsMetric} />
                <KpiCard title="Conversion Rate" value={conversionRate} icon={ICONS.conversionMetric} />
                <KpiCard title="Average Deal Value" value={`₹${avgDealValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} icon={ICONS.dealValueMetric} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SalesFunnel leads={leads} stages={settings.pipeline_stages.filter(s => s !== 'Lost')} />
                <LeadsBySourceChart leads={leads} />
            </div>
            <LeadGenerationChart leads={leads} />
        </div>
    );
};

export default Reports;