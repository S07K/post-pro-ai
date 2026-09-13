const Container = (props: { title: string; subtitle?: string; children: React.ReactNode }) => {
  return (
    <section className="pt-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl text-default-900">{props.title}</h2>
        {props.subtitle ? <p className="text-default-500 text-sm">{props.subtitle}</p> : null}
      </div>
      {props.children}
    </section>
  );
};

export default Container;
