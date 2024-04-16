'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { Send } from 'lucide-react';

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    content: '',
  });

  const handleSubmit = (e: {preventDefault: () => void;}) => {
    e.preventDefault();
    fetch('http://localhost:3758/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    }).then((res) => {
      if (res.ok) {
        alert('感谢您的反馈！');
        setFeedback({
          name: '',
          email: '',
          content: '',
        });
      } else {
        alert('提交失败，请稍后再试！');
      }
    });
  };

  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <CardTitle>反馈意见</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <Input
            className="rounded-lg border bg-card text-card-foreground shadow-sm p-4"
            type="text"
            placeholder="姓名"
            value={feedback.name}
            onChange={
              (e) => setFeedback((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Input
            className="rounded-lg border bg-card text-card-foreground shadow-sm p-4"
            type="email"
            placeholder="邮箱"
            value={feedback.email}
            onChange={
              (e) => setFeedback((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <Textarea
            className="w-full rounded-lg border bg-card text-card-foreground shadow-sm p-4"
            placeholder="请留下您的反馈意见"
            value={feedback.content}
            onChange={
              (e) => setFeedback((prev) => ({ ...prev, content: e.target.value }))
            }
          />
          <Button type="submit" className="mt-4">
            <Send className="mr-2" size={16} />
            提交
          </Button>
        </form>
        <p className="text-sm text-card-foreground mt-4">
          如果您有任何问题，请发送邮件至&nbsp;
          <Link href="mailto:support@hota.eu.org" className="text-primary">
            support@hota.eu.org
          </Link>
          。
        </p>
      </CardContent>
    </Card>
  );
};

export default FeedbackPage;