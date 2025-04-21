<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;


class OrderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;
    protected $message;
    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order, $message)
    {
        //
        $this->order = $order;
        $this->message = $message;

    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {

        return ['broadcast', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {

        return $this->toDatabase($notifiable);
    }


    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->message,
            'url' => route("order.details", $this->order['id']),
            'notifiable_id' => $this->order['id'],
            'notifiable_type' => "Order",
        ];
    }

    public function toBroadcast($notifiable)
    {
        return [
            'data' => [
                'message' => $this->message,
                'url' => route("order.details", $this->order['id']),
                'notifiable_id' => $this->order['id'],
                'notifiable_type' => "Order"
            ],
            'created_at' => Carbon::now()
        ];
    }


}
