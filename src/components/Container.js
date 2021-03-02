export const Container = ({ children, className }) => {
  return (
    <section className={`
      ${className}
      max-w-screen-md mx-auto mt-2 text-white p-5`}
    >
      {children}
    </section>
  )
}