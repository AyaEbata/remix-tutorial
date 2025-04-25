import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import type { FunctionComponent } from "react";
import { ContactRecord, getContact, updateContact } from "../data";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

// ファイル名の$contactIdはURLパラメータという
// loaderにURLパラメータが渡されるのでparams.contactIdで取得できるようになる
export const loader = async ({ params }: LoaderFunctionArgs) => {
  // Invariantは、ファイル名とコードの間でパラメータ名が間違っている場合などに、カスタムメッセージでエラーをスローすることができる
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  // contactがない場合はResponseで404して返すことができる
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return Response.json({ contact });
};

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
};

// contacts.$contactId.tsxというファイル名で作成すると、
// /contacts/123や/contacts/abcに対応したURLで画面が作成できる。
// 参考: https://remix.run/docs/en/main/file-conventions/routes
export default function Contact() {
  // const contact = {
  //   first: "Your",
  //   last: "Name",
  //   avatar: "https://placecats.com/200/200",
  //   twitter: "your_handle",
  //   notes: "Some notes",
  //   favorite: true,
  // };
  const { contact } = useLoaderData<typeof loader>();

  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p>
            <a
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          {/* actionはLinkのtoと同じ */}
          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  // ページ遷移やナビゲーションなしでフォームを送信したい場合useFetcherのfetcher.Formを使う
  // 新しいレコードを作成、削除するのではなく、現在表示しているページのデータだけを変更したい場合使用する
  // fetcher.FormはナビゲーションではないのでURLは変更されず、履歴スタックも影響を受けない
  const fetcher = useFetcher();
  // const favorite = contact.favorite;
  // fetcherはFormDataがactionに送信されていることを認識している
  // actionに送信されていたらformDataの値を利用する
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};
