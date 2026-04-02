import ContractDetailWorkspace from "@/components/features/contracts/ContractDetailWorkspace";

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = await params;

  return <ContractDetailWorkspace contractId={contractId} />;
}
