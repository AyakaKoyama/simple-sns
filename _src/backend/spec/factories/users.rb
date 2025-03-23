FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password123" }
    password_confirmation { "password123" }
    
    # テスト用に確認済みとしてマーク
    trait :confirmed do
      after(:create) do |user|
        user.update_column(:confirmed_at, Time.current)
      end
    end
  end
end 