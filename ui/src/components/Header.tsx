type HeaderProps = {
  title: string;
  subtitle?: string;
  cta?: React.ReactNode;
  extra?: React.ReactNode;
};

export default function Header({ title, subtitle, cta, extra }: HeaderProps) {
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex items-end justify-between w-full">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {title}
        </h1>
        {extra && extra}
        {cta && cta}
      </div>
      {subtitle && <p className="leading-7">{subtitle}</p>}
    </div>
  );
}
