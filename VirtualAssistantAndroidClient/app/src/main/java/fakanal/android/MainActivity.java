package fakanal.android;

import android.speech.tts.TextToSpeech;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Locale;

import fakanal.android.model.ChatMessage;
import fakanal.android.model.ChatMessageAdapter;
import fakanal.android.network.ServerAPI;
import fakanal.android.network.ServerAPIBuilder;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity implements Callback<ResponseBody> {
    private static final String TAG = MainActivity.class.getName();
    public static ServerAPI API;

    private RecyclerView recyclerView;
    private ChatMessageAdapter adapter;

    private Button sendButton;
    private EditText editText;

    TextToSpeech textToSpeech;

    // Address is hardcoded for now, later may be injected.
    private String serverAddress = "35.156.26.234";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        final Callback<ResponseBody> thiz = this;

        setContentView(R.layout.activity_main);

        sendButton = (Button) findViewById(R.id.button);
        editText = (EditText) findViewById(R.id.editText);

        textToSpeech = new TextToSpeech(getApplicationContext(), new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                if(status != TextToSpeech.ERROR) {
                    textToSpeech.setLanguage(Locale.US);
                }
            }
        });

        // Simple click listener
        sendButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                String message = String.valueOf(editText.getText());
                message = message.trim();

                if (message == null || message.isEmpty()) {
                    Log.i(TAG, "No message added");
                    Toast.makeText(MainActivity.this, "No message added", Toast.LENGTH_LONG).show();
                }
                else {
                    Log.i(TAG, "Sending request to server with message: " + message);

                    // Own UI
                    sendMessage(message);
                    editText.setText("");

                    API = new ServerAPIBuilder(serverAddress).build();
                    Call<ResponseBody> helloWorldApiCall = API.helloWorldCall(message);
                    helloWorldApiCall.enqueue(thiz);
                }
            }
        });

        recyclerView = (RecyclerView) findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new ChatMessageAdapter(this, new ArrayList<ChatMessage>());
        recyclerView.setAdapter(adapter);

        editText.requestFocus();
    }

    @Override
    public void onResponse(Call<ResponseBody> helloWorldApiCall, Response<ResponseBody> response) {
        if (response.isSuccessful()) {
            Log.i(TAG, "Successfully got answer from the server, response: " + response);
            try {
                mimicOtherMessage(response.body().string());
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            Log.e(TAG, "Failed to get a success answer from the server, response: " + response.code());

        }
    }

    private void sendMessage(String message) {
        ChatMessage chatMessage = new ChatMessage(message, true);
        adapter.add(chatMessage);
        recyclerView.scrollToPosition(adapter.getItemCount() - 1);
    }

    private void mimicOtherMessage(String message) {
        ChatMessage chatMessage = new ChatMessage(message, false);
        adapter.add(chatMessage);
        recyclerView.scrollToPosition(adapter.getItemCount() - 1);
        textToSpeech.speak(message, TextToSpeech.QUEUE_FLUSH, null);
    }

    @Override
    public void onFailure(Call<ResponseBody> helloWorldApiCall, Throwable t) {
        Log.e(TAG, "Failed to get answer from the server", t);
        mimicOtherMessage(":((");
    }
}
