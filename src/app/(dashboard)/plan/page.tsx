import { getCurrentSession } from "@/lib/auth/session";
import PlanManager from "@/modules/plan/client/plan-manager";
import { getUserPlans } from "@/modules/plan/service";

export const dynamic = "force-dynamic";

export default async function PlanPage() {
    const session = await getCurrentSession();
    const initialPlans = session?.user?.id
        ? await getUserPlans(session.user.id)
        : [];

    return <PlanManager initialPlans={initialPlans} />;
}
