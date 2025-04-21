<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class ReviewNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $review;
    protected $message;
    /**
     * Create a new notification instance.
     */
    public function __construct(Review $review, string $message)
    {
        //
        $this->review = $review;
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // return ['mail'];
        return ['database', 'broadcast'];
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
            'url' => "/product/reviews",
            'notifiable_id' => $this->review['productId'],
            'notifiable_type' => "Review"
        ];
    }

    public function toBroadcast($notifiable)
    {
        return [
            'data' => [
                'message' => $this->message,
                'url' => "/product/reviews",
                'notifiable_id' => $this->review['productId'],
                'notifiable_type' => "Review"
            ],
            'created_at' => Carbon::now()
        ];

    }


}
