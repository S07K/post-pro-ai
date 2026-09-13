import Link from "next/link";
import AppShell from "../components/AppShell";
import NewProjectAction from "../components/HeaderDashBoard";
import Container from "./components/Container";
import CardsContainer from "./components/CardsContainer";
import Analytics from "./components/Analytics";

const Dashboard: React.FC = () => {
  return (
    <AppShell title="Home" subtitle="An overview of your recent work and results." actions={<NewProjectAction />}>
      <Container
        title="Recent posts"
        subtitle="Your latest generated, scheduled and published posts."
        action={
          <Link href="/projects" className="text-sm font-semibold text-primary-600 hover:underline">
            See all projects
          </Link>
        }
      >
        <CardsContainer />
      </Container>
      <Container id="analytics" title="Insights" subtitle="Based on the posts across all of your projects.">
        <Analytics />
      </Container>
    </AppShell>
  );
};

export default Dashboard;
