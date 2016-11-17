package fakanal.android;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import fakanal.android.network.ServerAPI;
import fakanal.android.network.ServerAPIBuilder;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity implements Callback<Void> {
    private static final String TAG = MainActivity.class.getName();
    public static ServerAPI API;

    private final Button sendButton = (Button) findViewById(R.id.button);
    private final EditText editText = (EditText) findViewById(R.id.editText);
    private final TextView textView = (TextView) findViewById(R.id.textView);

    // Address is hardcoded for now, later may be injected.
    private String serverAddress = "35.156.26.234";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        final Callback<Void> thiz = this;

        // Simple click listener
        sendButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                String message = String.valueOf(editText.getText());
                Log.i(TAG, "Sending request to server with message: " + message);

                API = new ServerAPIBuilder(serverAddress).build();
                Call<Void> helloWorldApiCall = API.helloWorldCall(message);
                helloWorldApiCall.enqueue(thiz);
            }
        });

        setContentView(R.layout.activity_main);
    }

    @Override
    public void onResponse(Call<Void> helloWorldApiCall, Response<Void> response) {
        if (response.isSuccessful()) {
            Log.i(TAG, "Successfully got answer from the server, response: " + response);
            textView.setText(response.message());
        } else {
            Log.e(TAG, "Failed to get a success answer from the server, response: " + response.code());
            textView.setText(":(");
        }
    }

    @Override
    public void onFailure(Call<Void> helloWorldApiCall, Throwable t) {
        Log.e(TAG, "Failed to get answer from the server", t);
        textView.setText(":((");
    }
}
