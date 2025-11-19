import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export interface CounterCardProps {
    title: string;
    description: string;
    counter: number | string;
}


export function CounterCard({ title, description, counter }: CounterCardProps) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
                <CardAction>
                    <Button variant="link">Ver mais</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="flex items-center">
                    <span className="text-2xl font-bold">{counter}</span>
                </div>
            </CardContent>
        </Card>
    )
}
