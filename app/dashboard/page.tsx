import AppShell from "../components/AppShell";
import NewProjectAction from "../components/HeaderDashBoard";
import Container from "./components/Container";
import CardsContainer from "./components/CardsContainer";
import Analytics from "./components/Analytics";

const Dashboard: React.FC = () => {
  return (
    <AppShell title="Dashboard" subtitle="An overview of your recent work and results." actions={<NewProjectAction />}>
      <Container title="Recent posts">
        <CardsContainer />
      </Container>
      <Container title="Analytics">
        <Analytics />
      </Container>
    </AppShell>
  );
};

export default Dashboard;
