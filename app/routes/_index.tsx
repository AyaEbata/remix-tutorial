// http://localhost:xxxxのようなルートにいるときに、Outletで表示する子がないと、レンダリングするものがなくて空白になる
// インデックスルートは、そのスペースを埋めるためのデフォルトの子ルートになる
export default function Index() {
  return (
    <p id="index-page">
      This is a demo for Remix.
      <br/>
      Check out{" "}
      <a href="https://remix.run">the docs at remix.run</a>.
    </p>
  );
}
