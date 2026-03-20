import LoadingButton from "../../components/LoadingButton";

function HelpPage({ setPageCode }) {
  return (
    <section className="landing-content">
      <h1>Help</h1>
      <p>
        Use the page code buttons in the header to navigate around CEEFAX.
      </p>
      <LoadingButton action={() => setPageCode("100000.000")}>
        Back to Home
      </LoadingButton>
    </section>
  );
}

export default HelpPage;
