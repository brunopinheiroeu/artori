import TutorLayout from "@/components/TutorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";

const TutorEarnings = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");

  // Mock earnings data - in a real app, this would come from an API
  const earningsData = {
    totalEarnings: 2450,
    thisMonth: 850,
    lastMonth: 720,
    pendingPayouts: 320,
    completedPayouts: 2130,
    averageHourlyRate: 45,
    totalHours: 54.5,
    sessionsCompleted: 32,
  };

  // Mock transaction history
  const transactions = [
    {
      id: "1",
      studentName: "Alice Johnson",
      subject: "Mathematics",
      date: new Date(),
      duration: "1 hour",
      rate: 45,
      amount: 45,
      status: "completed",
      payoutDate: new Date(),
    },
    {
      id: "2",
      studentName: "Bob Smith",
      subject: "Physics",
      date: subDays(new Date(), 1),
      duration: "45 minutes",
      rate: 45,
      amount: 35,
      status: "completed",
      payoutDate: subDays(new Date(), 1),
    },
    {
      id: "3",
      studentName: "Carol Davis",
      subject: "Chemistry",
      date: subDays(new Date(), 2),
      duration: "1.5 hours",
      rate: 45,
      amount: 65,
      status: "pending",
      payoutDate: null,
    },
    {
      id: "4",
      studentName: "David Wilson",
      subject: "Mathematics",
      date: subDays(new Date(), 3),
      duration: "1 hour",
      rate: 45,
      amount: 45,
      status: "completed",
      payoutDate: subDays(new Date(), 3),
    },
    {
      id: "5",
      studentName: "Emma Brown",
      subject: "English",
      date: subDays(new Date(), 5),
      duration: "1 hour",
      rate: 50,
      amount: 50,
      status: "completed",
      payoutDate: subDays(new Date(), 5),
    },
    {
      id: "6",
      studentName: "Frank Miller",
      subject: "Biology",
      date: subDays(new Date(), 7),
      duration: "1 hour",
      rate: 45,
      amount: 45,
      status: "pending",
      payoutDate: null,
    },
  ];

  // Mock monthly earnings for chart
  const monthlyEarnings = [
    { month: "Jan", earnings: 680, sessions: 15 },
    { month: "Feb", earnings: 720, sessions: 16 },
    { month: "Mar", earnings: 850, sessions: 19 },
    { month: "Apr", earnings: 920, sessions: 21 },
    { month: "May", earnings: 780, sessions: 17 },
    { month: "Jun", earnings: 850, sessions: 19 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const completedTransactions = transactions.filter(
    (t) => t.status === "completed"
  );
  const pendingTransactions = transactions.filter(
    (t) => t.status === "pending"
  );

  return (
    <TutorLayout
      title="Earnings"
      description="Track your income and manage payouts."
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Earnings
                  </p>
                  <p className="text-3xl font-bold text-emerald-600">
                    ${earningsData.totalEarnings.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    All time
                  </p>
                </div>
                <div className="p-3 rounded-full bg-emerald-100">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    This Month
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${earningsData.thisMonth}
                  </p>
                  <p className="text-sm text-blue-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18% from last month
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Hourly Rate
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${earningsData.averageHourlyRate}
                  </p>
                  <p className="text-sm text-purple-600 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Average rate
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-orange-600">
                    ${earningsData.pendingPayouts}
                  </p>
                  <p className="text-sm text-orange-600 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Awaiting payout
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <CreditCard className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Overview and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Earnings Chart */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Monthly Earnings</span>
                </CardTitle>
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                    <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyEarnings.map((month, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 text-sm font-medium text-gray-600">
                        {month.month}
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
                            style={{
                              width: `${(month.earnings / 1000) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ${month.earnings}
                      </div>
                      <div className="text-xs text-gray-600">
                        {month.sessions} sessions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Performance Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/40 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">
                    {earningsData.sessionsCompleted}
                  </div>
                  <div className="text-sm text-gray-600">
                    Sessions Completed
                  </div>
                </div>
                <div className="text-center p-4 bg-white/40 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {earningsData.totalHours}h
                  </div>
                  <div className="text-sm text-gray-600">Total Hours</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion Rate</span>
                    <span>94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "94%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Student Satisfaction</span>
                    <span>4.8/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: "96%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Time</span>
                    <span>&lt; 2h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "88%" }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="backdrop-blur-sm bg-white/60 border-white/20">
              <TabsTrigger value="all">
                All Transactions ({transactions.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedTransactions.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingTransactions.length})
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" className="bg-white/60">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Card className="backdrop-blur-sm bg-white/60 border-white/20 shadow-xl">
            <TabsContent value="all" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payout Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.studentName}
                      </TableCell>
                      <TableCell>{transaction.subject}</TableCell>
                      <TableCell>
                        {format(transaction.date, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{transaction.duration}</TableCell>
                      <TableCell>${transaction.rate}/hr</TableCell>
                      <TableCell className="font-semibold">
                        ${transaction.amount}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1 capitalize">
                            {transaction.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {transaction.payoutDate
                          ? format(transaction.payoutDate, "MMM d, yyyy")
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="completed" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payout Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.studentName}
                      </TableCell>
                      <TableCell>{transaction.subject}</TableCell>
                      <TableCell>
                        {format(transaction.date, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{transaction.duration}</TableCell>
                      <TableCell>${transaction.rate}/hr</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        ${transaction.amount}
                      </TableCell>
                      <TableCell>
                        {transaction.payoutDate
                          ? format(transaction.payoutDate, "MMM d, yyyy")
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="pending" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Expected Payout</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.studentName}
                      </TableCell>
                      <TableCell>{transaction.subject}</TableCell>
                      <TableCell>
                        {format(transaction.date, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{transaction.duration}</TableCell>
                      <TableCell>${transaction.rate}/hr</TableCell>
                      <TableCell className="font-semibold text-orange-600">
                        ${transaction.amount}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        Next Friday
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </TutorLayout>
  );
};

export default TutorEarnings;
