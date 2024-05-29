import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RetrievePage() {
  const [retrieveCode, setRetrieveCode] = useState("");
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold leading-none">取件</h2>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Tabs defaultValue="files">
            <TabsList>
              <TabsTrigger value="files">文件</TabsTrigger>
              <TabsTrigger value="collections">集合</TabsTrigger>
            </TabsList>
            <TabsContent value="files">
              <InputOTP maxLength={5} value={retrieveCode} pattern="^[a-km-z1-9]+$"
                onChange={(code) => setRetrieveCode(code)}
                onComplete={() => navigate(`/files/${retrieveCode}`)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                </InputOTPGroup>
              </InputOTP>
            </TabsContent>
            <TabsContent value="collections">
              <InputOTP maxLength={5} value={retrieveCode} pattern="^[a-km-z1-9]+$"
                onChange={(code) => setRetrieveCode(code)}
                onComplete={() => navigate(`/collections/${retrieveCode}`)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                </InputOTPGroup>
              </InputOTP>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}