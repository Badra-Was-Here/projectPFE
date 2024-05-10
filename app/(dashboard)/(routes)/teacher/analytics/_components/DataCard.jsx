import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DataCard({ value, label, shouldFormat = true }) {
  return (
    <Card className="bg-sky-100/30">
      <CardHeader className=" flex flex-row  items-center justify-between space-y-0 pb-2">
        <CardTitle className=" text-md font-normal">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold ">
          {shouldFormat ? (
            <>
                {value} <span>د.ت</span>
            </>
          ) :value} 
        </div>
      </CardContent>
    </Card>
  );
}
