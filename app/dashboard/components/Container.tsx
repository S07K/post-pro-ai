const Container = (props: {
  title: string;
  bg?: string;
  font?: string;
  children: React.ReactNode;
}) => {
  return (
    <section style={{
        background: `${props.bg ? props.bg : ""}`
    }} className={`flex flex-col items-center justify-center gap-4 pb-10 ${props.bg ? '' : 'post-pro bg-primary-50'}`}>
      <div
        className="flex flex-col max-w-[1440px] w-full px-6"
      >
        <p className={`mb-1 text-2xl ${props.font ? props.font : "text-default-800"} font-semibold pt-12`}>{props.title}</p>
        {props.children}
      </div>
    </section>
  );
};

export default Container;
