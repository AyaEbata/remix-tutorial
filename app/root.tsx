import {
  Form,
  Link,
  Links,
  Meta, NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData, useNavigation, useSubmit,
} from "@remix-run/react";
import { LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import appStylesHref from "./app.css?url";
import { ContactMutation, createEmptyContact, getContacts } from "./data";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

// CSSファイルをJavaScriptモジュールに直接インポート
// ここで設定したものは<Links />で呼び出せる
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

// データを簡単に取り込むためにloaderとuseLoaderDataを使う
// チュートリアルで使っているRemixのjsonは非推奨なのでResponse.jsonを使用
// loaderのrequestから検索のパラメータqにアクセスできる
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // const contacts = await getContacts();
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return Response.json({ contacts, q });
};

// actionはformのリクエストをサーバーに送信する
export const action = async () => {
  const contact = await createEmptyContact();
  // return Response.json({ contact });
  // 新しい連絡先を作成して編集ページにリダイレクトする
  return redirect(`/contacts/${contact.id}/edit`);
};

// Root Route
// UIで最初にレンダリングされるコンポーネント
// ページ全体で使用するグローバルなレイアウトをここで記載する
// Global layout: ヘッダーやフッター、ナビゲーションなど、ページ全体で共通して使われるレイアウト
export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  // ユーザーがアプリ内を移動する際、Remixは次のページのデータ読み込みのため、前のページを表示したままにする
  // そうすると、アプリの反応が鈍く感じられてしまうので、ユーザーにフィードバックを提供するのにuseNavigationのnavigation.stateで判断できる
  const navigation = useNavigation();
  const [query, setQuery] = useState(q || "");
  const submit = useSubmit();
  // このソースコードではネットワーク遅延を擬似的に再現しているので、読み込み中はスピナーを表示するために以下を追加
  // ユーザーが操作してデータの読み込み中になるとnavigation.locationに?q=aaaのような値が入る
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

  // 検索後にブラウザバックすると、リストはフィルタリングされなくなるのに検索フォームには入力した値が残ってしまうのでその対応
  useEffect(() => {
    // const searchField = document.getElementById("q");
    // if (searchField instanceof HTMLInputElement) {
    //   searchField.value = q || "";
    // }
    setQuery(q || "");
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            {/* ユーザーの入力に合わせて絞り込みたい場合、FormのonChangeでsubmitを呼び出す */}
            {/* そうすると、入力が変わるごとに検索結果が反映される */}
            <Form
              id="search-form"
              role="search"
              onChange={(event) => {
                // submit(event.currentTarget)
                // 検索のたびに履歴スタックが残ってしまうので、現在のエントリをプッシュするのではなく、replaceを指定して置き換える
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
            >
              {/* URLと入力の状態を同期するためにdefaultValueを追加 */}
              <input
                id="q"
                value={query}
                aria-label="Search contacts"
                placeholder="Search"
                className={searching ? "loading" : ""}
                type="search"
                name="q"
                onChange={(event) =>
                  setQuery(event.currentTarget.value)
                }
              />
              {/*<div id="search-spinner" aria-hidden hidden={true} />*/}
              <div id="search-spinner" aria-hidden hidden={!searching} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {/* aタグではなく、Linkタグを使うことで、クライアントサイドルーティングになる */}
            {/* アプリはサーバーに別のドキュメントをリクエストすることなくURLを更新できるようになる */}
            {/*<ul>*/}
            {/*  <li>*/}
            {/*    /!*<a href={`/contacts/1`}>Your Name</a>*!/*/}
            {/*    <Link to={`/contacts/1`}>Your Name</Link>*/}
            {/*  </li>*/}
            {/*  <li>*/}
            {/*    /!*<a href={`/contacts/2`}>Your Friend</a>*!/*/}
            {/*    <Link to={`/contacts/2`}>Your Friend</Link>*/}
            {/*  </li>*/}
            {/*</ul>*/}

            {/* contactsを使って実装 */}
            {contacts.length ? (
              <ul>
                {contacts.map((contact: ContactMutation) => (
                  <li key={contact.id}>
                    {/* サイドバーでどのレコードを見ているのか分かりにくくなったので、NavLinkを使って変更 */}
                    {/* ユーザーがNavLinkのtoと一致するURLにアクセスしている場合はisActiveがtrueになる */}
                    {/* アクティブになる直前（データの読み込み中）は、isPendingがtrueになる */}
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isActive
                          ? "active"
                          : isPending
                            ? "pending"
                            : ""
                      }
                      to={`contacts/${contact.id}`}
                    >
                      <Link to={`contacts/${contact.id}`}>
                        {contact.first || contact.last ? (
                          <>
                            {contact.first} {contact.last}
                          </>
                        ) : (
                          <i>No Name</i>
                        )}{" "}
                        {contact.favorite ? (
                          <span>★</span>
                        ) : null}
                      </Link>
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>

        {/* 子ルートを親レイアウト内でレンダリングするには<Outlet />を入れる */}
        {/* /contacts/1の画面が親の画面で表示されるということ */}
        <div id="detail" className={
          // navigation.stateはidle/loading/submittingが返る
          navigation.state === "loading" && !searching ? "loading" : ""
        }>
          <Outlet />

          <Form action="threejs" className="mt-4">
            <button>Three.js</button>
          </Form>

          <Form action="graphql" className="mt-2">
            <button>GraphQL</button>
          </Form>
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
