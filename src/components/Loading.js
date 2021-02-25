export const Loading = (props) => {
  return (
    <section className="max-w-screen-md mx-auto mt-20 text-white p-5">
      <progress className="nes-progress" value={props.loadingPercent} max="100"></progress>
    </section>
  )
}