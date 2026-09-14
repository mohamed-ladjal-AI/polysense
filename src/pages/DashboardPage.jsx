import MetricsRow from '../components/sections/MetricsRow';
import ProcessTrends from '../components/sections/ProcessTrends';
import PredictionsPanel from '../components/sections/PredictionsPanel';
import AiRecommendation from '../components/sections/AiRecommendation';
import KeyVariables from '../components/sections/KeyVariables';
import ActiveAlerts from '../components/sections/ActiveAlerts';
import QuickSummary from '../components/sections/QuickSummary';
import LivePrediction from '../components/sections/LivePrediction';

export default function DashboardPage() {
  return (
    <>
      <MetricsRow />
      <div className="mb-4">
        <LivePrediction />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <ProcessTrends />
        <div className="flex flex-col gap-4">
          <PredictionsPanel />
          <AiRecommendation />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <KeyVariables />
        <ActiveAlerts />
        <QuickSummary />
      </div>
    </>
  );
}