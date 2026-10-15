import { getMembershipInfos } from "@/actions/membership.actions";

import MembershipManager from "./MembershipManager";

export default async function MembershipPage() {
  const result =
    await getMembershipInfos();

  if (!result.success) {
    return (
      <main>

        <p>
          Error:{" "}
          {result.error.message}
        </p>
      </main>
    );
  }

  return (
    <main>
      <MembershipManager
        contents={result.data}
      />
    </main>
  );
}