import AppShell from "../components/AppShell";
import NewProjectAction from "../components/HeaderDashBoard";
import Container from "../dashboard/components/Container";
import Analytics from "../dashboard/components/Analytics";

const Insights: React.FC = () => {
  return (
    <AppShell title="Insights" subtitle="How your posts are doing across all of your projects." actions={<NewProjectAction />}>
      <Container title="Overview" subtitle="Based on the posts across all of your projects.">
        <Analytics />
      </Container>
    </AppShell>
  );
};

export default Insights;
