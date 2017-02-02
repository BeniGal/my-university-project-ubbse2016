package fakanal.android.model;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.List;

import fakanal.android.R;

public class ChatMessageAdapter extends RecyclerView.Adapter<ChatMessageAdapter.MessageHolder> {
    private static final int MY_MESSAGE = 0, OTHER_MESSAGE = 1;

    private List<ChatMessage> messageList;
    private Context context;

    public ChatMessageAdapter(Context context, List<ChatMessage> data) {
        this.context = context;
        messageList = data;
    }

    @Override
    public int getItemCount() {
        return messageList == null ? 0 : messageList.size();
    }

    @Override
    public int getItemViewType(int position) {
        ChatMessage item = messageList.get(position);

        if (item.isMine()) return MY_MESSAGE;
        else return OTHER_MESSAGE;
    }

    @Override
    public MessageHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        if (viewType == MY_MESSAGE) {
            return new MessageHolder(LayoutInflater.from(context).inflate(R.layout.item_mine_message, parent, false));
        } else {
            return new MessageHolder(LayoutInflater.from(context).inflate(R.layout.item_other_message, parent, false));
        }
    }

    public void add(ChatMessage message) {
        messageList.add(message);
        notifyItemInserted(messageList.size() - 1);
    }

    @Override
    public void onBindViewHolder(MessageHolder holder, int position) {
        ChatMessage chatMessage = messageList.get(position);

        holder.textViewMessage.setVisibility(View.VISIBLE);
        holder.textViewMessage.setText(chatMessage.getContent());
    }

    class MessageHolder extends RecyclerView.ViewHolder {
        TextView textViewMessage;

        MessageHolder(View itemView) {
            super(itemView);
            textViewMessage = (TextView) itemView.findViewById(R.id.text_view_message);
        }
    }
}