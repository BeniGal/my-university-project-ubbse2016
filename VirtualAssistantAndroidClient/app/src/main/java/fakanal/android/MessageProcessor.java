package fakanal.android;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.media.MediaPlayer;
import android.net.Uri;
import android.speech.tts.TextToSpeech;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Locale;

import fakanal.android.model.ChatMessage;
import fakanal.android.model.ChatMessageAdapter;
import fakanal.android.network.ServerAPI;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;

public class MessageProcessor {
    private static final String TAG = MessageProcessor.class.getName();

    private final Activity rootActivity;
    private final ServerAPI API;

    private final String WELCOME_MESSAGE =
            "Hello! My name is Sis. How can I help you?";
    private final String INTRODUCING_MYSELF =
            "I am the Virtual Assistant of the Fakanál Team. But you can call me Sis.";
    private final TextToSpeech textToSpeech;
    private final RecyclerView recyclerView;
    private final ChatMessageAdapter adapter;

    public MessageProcessor(Activity rootActivity, ServerAPI API) {
        this.rootActivity = rootActivity;
        this.API = API;

        recyclerView = (RecyclerView) rootActivity.findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(rootActivity));
        adapter = new ChatMessageAdapter(rootActivity, new ArrayList<ChatMessage>());
        recyclerView.setAdapter(adapter);

        TextToSpeech.OnInitListener ttsOnInitLister = new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                if (status != TextToSpeech.ERROR) {
                    textToSpeech.setLanguage(Locale.US);
                }
            }
        };
        textToSpeech = new TextToSpeech(rootActivity.getApplicationContext(), ttsOnInitLister);

        mimicOtherMessage(WELCOME_MESSAGE);
    }

    public void process(String message) {
        if (message == null || message.isEmpty()) {
            Log.i(TAG, "No message added");
            Toast.makeText(rootActivity, "No message added", Toast.LENGTH_LONG).show();
        }
        else {
            sendMessage(message);

            if (message.toLowerCase().startsWith("who are you")) {
                mimicOtherMessage(INTRODUCING_MYSELF);
            }
            else if (message.toLowerCase().startsWith("who is florin iordache")) {
                mimicDragneaMessage();
            }
            else if (message.toLowerCase().startsWith("start") || message.toLowerCase().startsWith("open")) {
                executeAction(message);
            }
            else {
                getAnswer(message);
            }
        }
    }

    public void sendMessage(String message) {
        ChatMessage chatMessage = new ChatMessage(message, true);
        adapter.add(chatMessage);
        recyclerView.scrollToPosition(adapter.getItemCount() - 1);
    }

    public void mimicOtherMessage(String message) {
        ChatMessage chatMessage = new ChatMessage(message, false);
        adapter.add(chatMessage);
        recyclerView.scrollToPosition(adapter.getItemCount() - 1);
        textToSpeech.speak(message, TextToSpeech.QUEUE_ADD, null);
    }

    public void mimicDragneaMessage() {
        ChatMessage chatMessage = new ChatMessage("Altă întrebare!", false);
        adapter.add(chatMessage);
        recyclerView.scrollToPosition(adapter.getItemCount() - 1);

        MediaPlayer mediaPlayer = MediaPlayer.create(rootActivity, R.raw.alta_intrebare);
        mediaPlayer.start();
    }

    private void getAnswer(String message) {
        Log.i(TAG, "Sending request to server with message: " + message);
        RequestBody body = RequestBody.create(okhttp3.MediaType.parse("application/json"), "{\"question\": \"" + message + "\"}");
        Call<ResponseBody> helloWorldApiCall = API.helloWorldCall("application/json", body);
        helloWorldApiCall.enqueue((Callback<ResponseBody>) rootActivity);
    }

    private void openYoutube() {
        rootActivity.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("http://www.youtube.com/")));
    }

    private void openFacebook() {
        Intent intent = rootActivity.getApplicationContext().getPackageManager().getLaunchIntentForPackage("com.facebook.lite");
        intent.addCategory(Intent.CATEGORY_LAUNCHER);
        rootActivity.startActivity(intent);
    }

    private void openTwitter() {
        Intent intent = rootActivity.getApplicationContext().getPackageManager().getLaunchIntentForPackage("com.twitter.android");
        intent.addCategory(Intent.CATEGORY_LAUNCHER);
        rootActivity.startActivity(intent);
    }

    private void closeKeyboard() {
        View view = rootActivity.getCurrentFocus();
        if (view != null) {
            InputMethodManager imm = (InputMethodManager) rootActivity.getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
        }
    }

    private void executeAction(String message) {
        closeKeyboard();

        String[] parts = message.split("\\s");

        if (parts.length > 1 && parts[1] != null && parts[1].toLowerCase().equals("youtube")) {
            openYoutube();
        } else if (parts.length > 1 && parts[1] != null && parts[1].toLowerCase().equals("facebook")) {
            openFacebook();
        } else if (parts.length > 1 && parts[1] != null && parts[1].toLowerCase().equals("twitter")) {
            openTwitter();
        } else mimicOtherMessage("What should I " + parts[0] + "?");
    }
}
