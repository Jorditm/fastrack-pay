import { Card } from "@/components/ui/card";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: REDIRECT IF NOT LOGGED IN

  return (
    <main className="flex h-screen w-full items-center justify-center bg-primary p-4 lg:bg-gray-100">
      <Card className="flex flex-col overflow-hidden rounded-lg p-12 lg:grid lg:h-full lg:w-full lg:grid-cols-2 lg:p-0">
        <div className="flex flex-[1.5] items-center justify-center">
          <div className="flex items-start justify-start gap-4">
            <Image
              src="/fastrackpay-icon.png"
              alt="Login Image"
              className="object-cover object-center"
              width={50}
              height={50}
            />
            <p className="pt-1.5 text-3xl font-bold text-primary">
              Fastrack Pay
            </p>
          </div>
        </div>
        <div className="flex flex-[1.5] items-center justify-center">
          {children}
        </div>
      </Card>
    </main>
  );
}
