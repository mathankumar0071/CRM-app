import React from 'react';
import Card from '../components/ui/Card';
import { useCrm } from '../hooks/useCrm';
import { ICONS, CHART_COLORS } from '../constants';
import { LeadStatus } from '../types';

const MetricCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
    <Card className="p-0">
        <div className="p-6 flex items-center gap-4">
            <div className="bg-primary-100 text-primary-600 p-3 rounded-lg">
                <div className="w-6 h-6">{icon}</div>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </Card>
);

const LeadsByStageChart = () => {
    const { leads, settings } = useCrm();
    const stageCounts = settings.pipeline_stages.map(stage => ({
        stage,
        count: leads.filter(lead => lead.status === stage).length,
    }));
    const maxCount = Math.max(...stageCounts.map(s => s.count), 1);

    return (
        <Card title="Leads by Stage">
            <div className="space-y-3 mt-2">
                {stageCounts.map(({ stage, count }, index) => (
                    <div key={stage} className="flex items-center">
                        <div className="w-28 text-sm text-gray-600 text-right pr-4">{stage}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-6">
                            <div
                                className="h-6 rounded-full text-white text-xs flex items-center justify-end px-2"
                                style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                            >
                                {count > 0 && <span>{count}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

const LeadSourceDistribution = () => {
    const { leads } = useCrm();
    const sourceCounts: { [key: string]: number } = leads.reduce((acc, lead) => {
        acc[lead.source] = (acc[lead.source] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const sortedSources = Object.entries(sourceCounts).sort(([, a], [, b]) => b - a);
    const totalLeads = leads.length;

    return (
        <Card title="Lead Source Distribution">
            <div className="grid grid-cols-2 gap-4 items-center">
                <div className="relative flex items-center justify-center w-40 h-40">
                    {/* Simplified donut chart SVG */}
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.9154943092" fill="transparent" stroke="#eee" strokeWidth="3"></circle>
                        {/* Segments would be calculated and rendered here in a real chart library */}
                        <circle cx="18" cy="18" r="15.9154943092" fill="transparent" stroke={CHART_COLORS[0]} strokeWidth="3" strokeDasharray="60, 100" strokeDashoffset="-0"></circle>
                        <circle cx="18" cy="18" r="15.9154943092" fill="transparent" stroke={CHART_COLORS[1]} strokeWidth="3" strokeDasharray="25, 100" strokeDashoffset="-60"></circle>
                        <circle cx="18" cy="18" r="15.9154943092" fill="transparent" stroke={CHART_COLORS[2]} strokeWidth="3" strokeDasharray="15, 100" strokeDashoffset="-85"></circle>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-bold">{totalLeads}</span>
                        <span className="text-sm text-gray-500">Total</span>
                    </div>
                </div>
                <ul className="space-y-2">
                    {sortedSources.map(([source, count], index) => (
                        <li key={source} className="flex items-center text-sm">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></span>
                            <span className="font-medium text-gray-700">{source}:</span>
                            <span className="ml-auto text-gray-600">{count}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    )
}


const Dashboard: React.FC = () => {
    const { leads, tasks, currentUser } = useCrm();

    const pendingTasks = tasks ? tasks.filter(t => t.status === 'Pending' && t.assigned_to === currentUser.id) : [];
    const newLeadsCount = leads ? leads.filter(l => l.status === 'New').length : 0;
    const dealsWonCount = leads ? leads.filter(l => l.status === 'Won').length : 0;
    const totalRevenue = leads ? leads.filter(l => l.status === 'Won').reduce((sum, lead) => sum + (lead.deal_value || 0), 0) : 0;
    const conversionRate = leads && leads.length > 0 ? ((dealsWonCount / leads.length) * 100).toFixed(1) + '%' : '0%';

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Welcome back, {currentUser.name ? currentUser.name.split(' ')[0] : 'User'}!</h1>
                <p className="text-gray-500 mt-1">Here's your performance summary for today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="New Leads" value={newLeadsCount} icon={ICONS.leadsMetric} />
                <MetricCard title="Conversion Rate" value={conversionRate} icon={ICONS.conversionMetric} />
                <MetricCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={ICONS.dealValueMetric} />
                <MetricCard title="Pending Tasks" value={pendingTasks.length} icon={ICONS.tasks} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LeadsByStageChart />
                <LeadSourceDistribution />
            </div>
        </div>
    );
};

export default Dashboard;