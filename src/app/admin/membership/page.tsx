import { getMembershipInfos } from "@/actions/membership.actions";

import MembershipManager from "./MembershipManager";

export default async function MembershipPage() {
  const result =
    await getMembershipInfos();

  if (!result.success) {
    return (
      <main>
        <h1>Informasi Keanggotaan</h1>

        <p>
          Error:{" "}
          {result.error.message}
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1>Informasi Keanggotaan</h1>

      <MembershipManager
        contents={result.data}
      />
    </main>
  );
}