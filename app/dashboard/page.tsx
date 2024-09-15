import Header from "../components/HeaderDashBoard";
import Container from "./components/Container";
import CardsContainer from "./components/CardsContainer";
import Analytics from "./components/Analytics";

const Dashboard: React.FC = () => {
    return (
        <>
            <Header />
            <Container title="History" bg={"linear-gradient(var(--color-dark), var(--color-500))"} font={"post-pro text-default-50"}>
                <CardsContainer />
            </Container>
            <Container title="Analytics (coming soon)">
                <Analytics />
            </Container>
        </>
    );
};

export default Dashboard;