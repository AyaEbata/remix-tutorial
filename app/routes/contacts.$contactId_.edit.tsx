import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getContact, updateContact } from "../data";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
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

  // 以下で各入力フィールドの値が取れる
  // getでnameを指定する
  // const firstName = formData.get("first");
  // const lastName = formData.get("last");

  // Object.fromEntriesで各入力フィールドの値をupdatesにまとめている
  // ので、updates.firstやupdates.lastで取得できるようになる
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
};

// ファイル名に$contactId_のようにアンスコをつけると、親ルートに自動的にネストされなくなる
// アンスコなしだと子ルート（ネストされたルート）となる
// URLは/contacts/:contactId/editになって、contacts.$contactId.tsxの中で<Outlet />を使ってレンダリングされることがなくなる
// よって親レイアウトとは分離している独立した画面として扱える
export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();
  // ブラウザの戻るボタンと同じ機能を持つキャンセルボタンを追加するためにuseNavigateを使用
  const navigate = useNavigate();

  return (
    <Form key={contact.id} id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          aria-label="First name"
          defaultValue={contact.first}
          name="first"
          placeholder="First"
          type="text"
        />
        <input
          aria-label="Last name"
          defaultValue={contact.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          defaultValue={contact.notes}
          name="notes"
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        {/*<button type="button">Cancel</button>*/}
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}
