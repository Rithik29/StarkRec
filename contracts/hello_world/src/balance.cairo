#[starknet::interface]
trait IBalance<T> {
    // Returns the current balance.
    fn get(self: @T) -> u128;
    // Increases the balance by the given amount.
    fn increase(ref self: T, a: u128);
    // Returns the event name.
    fn get_event(self: @T) -> felt252;
    // Updates the event name.
    fn set_event(ref self: T, event_name: felt252);
    // Updates yes_bets and no_bets.
    fn place_bet(ref self: T, yes_bet: u128, amount: u128);
}

#[starknet::contract]
mod Balance {
    use traits::Into;

    #[storage]
    struct Storage {
        value: u128,
        event: felt252,
        yes_bets: u128,
        no_bets: u128,
    }

    #[constructor]
    fn constructor(ref self: ContractState, value_: u128, event_: felt252) {
        self.value.write(value_);
        self.event.write(event_);
        self.yes_bets.write(0);
        self.no_bets.write(0);
    }

    #[abi(embed_v0)]
    impl Balance of super::IBalance<ContractState> {
        fn get(self: @ContractState) -> u128 {
            self.value.read()
        }
        fn increase(ref self: ContractState, a: u128) {
            self.value.write(self.value.read() + a);
        }
        fn get_event(self: @ContractState) -> felt252 {
            self.event.read()
        }
        fn set_event(ref self: ContractState, event_name: felt252) {
            self.event.write(event_name);
        }
        fn place_bet(ref self: ContractState, yes_bet: u128, amount: u128) {
            if yes_bet == 1{
                self.yes_bets.write(self.yes_bets.read() + amount);
            } else {
                self.no_bets.write(self.no_bets.read() + amount);
            }
        }
    }
}
