void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println("a0 "+String(analogRead(0)));
}