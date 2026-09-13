const Container = (props: {
  id?: string;
  title: string;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <section id={props.id} className="scroll-mt-20 rounded-lg border border-divider bg-content1 shadow-card">
      <div className="flex items-start justify-between gap-4 border-b border-divider px-4 pb-3 pt-4 md:px-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[17px] font-semibold text-default-900">{props.title}</h2>
            {props.badge}
          </div>
          {props.subtitle ? <p className="mt-0.5 text-[13px] text-default-600">{props.subtitle}</p> : null}
        </div>
        {props.action ? <div className="shrink-0">{props.action}</div> : null}
      </div>
      <div className="p-4 md:p-5">{props.children}</div>
    </section>
  );
};

export default Container;
