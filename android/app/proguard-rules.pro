# 1. Игнорируем предупреждения от сторонних SDK (чтобы сборка не падала)
-dontwarn com.unity3d.ads.**
-dontwarn com.unity3d.services.banners.**
-dontwarn com.google.api.client.**
-dontwarn com.google.crypto.tink.**
-dontwarn com.amazon.device.iap.**
-dontwarn org.joda.time.**
-dontwarn com.google.firebase.**
-dontwarn com.amazon.**
-dontwarn **

# 2. Мост Capacitor (Железная бронь ядра, чтобы JS общался с нативом)
-keep @com.getcapacitor.annotation.CapacitorPlugin class *
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod public *;
    @android.webkit.JavascriptInterface <methods>;
}
-keep class * extends com.getcapacitor.Plugin {
    public <init>(...);
}

-keepattributes JavascriptInterface
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# 3. Плагины авторизации (Железная бронь для входа через Google и Firebase)
-keep class com.capawesome.** { *; }
-keep class com.google.android.gms.auth.api.signin.** { *; }
-keep class com.google.firebase.auth.** { *; }

# 4. Cordova (Бронь для старых плагинов)
-keep class * extends org.apache.cordova.CordovaPlugin {
    public <init>(...);
    public boolean execute(java.lang.String, org.json.JSONArray, org.apache.cordova.CallbackContext);
}

# 5. Вырезание логов (Безопасно очищает мусор из консоли, не ломая код)
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}